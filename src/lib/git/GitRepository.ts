/**
 * Git Repository Simulation Engine
 *
 * ARCHITECTURAL PHILOSOPHY:
 * The GitRepository class is the high-level orchestrator of the Git4Data simulation.
 * It provides a purely functional implementation of a Directed Acyclic Graph (DAG) 
 * for commit history, leveraging an in-memory Virtual File System (VFS).
 */

import { FileSystem } from "../vfs/FileSystem";
import {
  GitObject,
  GitObjectType,
  GitCommit,
  ReflogEntry,
} from "./types";
import { GitCore } from "./GitCore";
import { GitRemote } from "./GitRemote";
import { GitBisectEngine } from "./GitBisectEngine";
import { GitAuditEngine } from "./GitAuditEngine";
import { GitMergeEngine } from "./GitMergeEngine";
import { GitOperationEngine } from "./GitOperationEngine";

export class GitRepository {
  // --- Core State Storage ---
  private objects: Map<string, GitObject> = new Map();
  private refs: Map<string, string> = new Map();
  private head: string = "master";
  private index: Map<string, string> = new Map();
  private remotes: Map<string, Map<string, string>> = new Map();
  
  // --- Specialized Sub-Engines ---
  private core: GitCore;
  private sync: GitRemote;
  private bisectEngine: GitBisectEngine;
  private audit: GitAuditEngine;
  private mergeEngine: GitMergeEngine;
  private ops: GitOperationEngine;

  private worktrees: Array<{ path: string; branch: string }> = [
    { path: "/repo", branch: "master" },
  ];

  private config: Map<string, string> = new Map();

  constructor(private fs: FileSystem) {
    this.remotes.set("origin", new Map());
    this.core = new GitCore(this.fs, this.objects);
    this.bisectEngine = new GitBisectEngine();
    this.audit = new GitAuditEngine();
    this.mergeEngine = new GitMergeEngine(this.fs, this.objects, this.core);
    this.ops = new GitOperationEngine(this.fs, this.core, this.objects);
    
    this.sync = new GitRemote(this.refs, this.remotes, (r, oh, nh, m) =>
      this.audit.addToReflog(r, oh, nh, m),
    );
  }

  public init(): void {
    if (this.refs.size > 0) return;
    this.refs.set("master", "");
    this.addToReflog("HEAD", null, "", "initial pull");
  }

  public async hashObject(content: string, type: GitObjectType = "blob", store: boolean = true): Promise<string> {
    return await this.core.hashObject(content, type, store);
  }

  public getObject(hash: string): GitObject | undefined {
    return this.objects.get(hash);
  }

  public async add(path: string): Promise<void> {
    return await this.ops.add(path, this.index);
  }

  public async commit(message: string, author: string, signature?: string): Promise<string> {
    const { commitHash, oldHash } = await this.ops.commit(message, author, this.index, this.head, this.refs, signature);
    this.addToReflog(this.head, oldHash, commitHash, `commit: ${message}`);
    return commitHash;
  }

  private addToReflog(ref: string, oldHash: string | null, newHash: string, message: string): void {
    this.audit.addToReflog(ref, oldHash, newHash, message);
  }

  public getReflog(): ReflogEntry[] { return this.audit.getReflog(); }
  public getHead(): string { return this.head; }
  public getCurrentCommit(): string | null { return this.refs.get(this.head) || null; }

  public async branch(name: string): Promise<void> {
    if (this.refs.has(name)) throw new Error(`Branch already exists: ${name}`);
    const currentCommit = this.getCurrentCommit();
    this.refs.set(name, currentCommit || "");
    this.addToReflog(name, null, currentCommit || "", `branch: Created from ${this.head}`);
  }

  public checkout(name: string): void {
    if (this.refs.has(name)) {
      this.head = name;
      this.addToReflog("HEAD", this.refs.get(this.head) || null, this.refs.get(name) || "", `checkout: moving to ${name}`);
    } else if (this.objects.has(name) && this.objects.get(name)?.type === "commit") {
      const oldHead = this.head;
      this.head = name;
      this.addToReflog("HEAD", oldHead, name, `checkout: moving to ${name.substring(0, 7)} (detached)`);
    } else {
      throw new Error(`error: pathspec '${name}' did not match any files`);
    }
  }

  public async reset(target: string, mode: "hard" | "soft" = "hard"): Promise<void> {
    const targetHash = this.refs.get(target) || target;
    if (!this.objects.has(targetHash)) throw new Error(`fatal: ambiguous argument '${target}'`);

    const oldHash = this.refs.get(this.head) || null;
    this.refs.set(this.head, targetHash);

    if (mode === "hard") {
      this.index.clear();
      await this.core.restoreStateFromCommit(targetHash);
    }
    this.addToReflog(this.head, oldHash, targetHash, `reset: moving to ${target}`);
  }

  public async revert(target: string, author: string): Promise<string> {
    return await this.ops.revert(target, author, (m) => this.commit(m, author));
  }

  public async merge(sourceBranch: string, author: string): Promise<{ status: "ff" | "merged" | "conflict"; hash?: string }> {
    const targetHash = this.refs.get(sourceBranch);
    const currentHash = this.refs.get(this.head) || null;
    if (!targetHash) throw new Error(`fatal: ${sourceBranch} is not a valid branch`);
    
    const result = await this.mergeEngine.merge(sourceBranch, targetHash, currentHash, this.head, this.index, (p) => this.fs.readFile(p), (m) => this.commit(m, author));
    if (result.status === "ff") this.refs.set(this.head, targetHash);
    else if (result.status === "merged" && result.updatedIndex) this.index = result.updatedIndex;
    return { status: result.status, hash: result.hash };
  }

  public getGraph(): { commits: (GitCommit & { hash: string })[]; branches: { name: string; hash: string }[] } {
    return this.audit.getGraph(this.refs, this.objects);
  }

  public getBranches(): Map<string, string> { return new Map(this.refs); }
  public getRemoteBranches(remote: string = "origin"): Map<string, string> { return new Map(this.remotes.get(remote) || new Map()); }
  public async push(remote: string, branch: string): Promise<void> { return await this.sync.push(remote, branch); }
  public async fetch(remote: string): Promise<void> { return await this.sync.fetch(remote); }
  public setConfig(key: string, value: string): void { this.config.set(key, value); }
  public getConfig(key: string): string | undefined { return this.config.get(key); }
  public getWorktrees(): Array<{ path: string; branch: string }> { return [...this.worktrees]; }

  public async addWorktree(path: string, branch: string): Promise<void> {
    if (this.worktrees.some((wt) => wt.path === path)) throw new Error(`fatal: worktree already exists at '${path}'`);
    if (!this.refs.has(branch)) await this.branch(branch);
    this.worktrees.push({ path, branch });
    this.addToReflog("HEAD", null, this.refs.get(branch) || "", `worktree: add ${path}`);
  }

  public async bisect(action: "start" | "good" | "bad" | "reset", target?: string): Promise<string> {
    if (action === "reset") {
      const { message, branch } = this.bisectEngine.reset();
      this.checkout(branch);
      return message;
    }
    if (action === "start") return this.bisectEngine.start(this.getGraph().commits.map((c) => c.hash), this.getCurrentCommit());
    if (!this.bisectEngine.isActive()) throw new Error("fatal: bisect not active. run 'git bisect start'");
    const currentHash = target || this.getCurrentCommit();
    if (!currentHash) throw new Error("fatal: could not identify current commit");
    return this.bisectEngine.execute(action as "good" | "bad", currentHash, (h) => this.checkout(h));
  }
}
