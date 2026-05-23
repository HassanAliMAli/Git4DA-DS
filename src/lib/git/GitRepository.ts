/**
 * Git Repository Simulation Engine
 *
 * ARCHITECTURAL PHILOSOPHY:
 * This class provides a high-fidelity, purely functional simulation of a Git object database.
 * It is not a wrapper around a system shell. It implements a true directed acyclic graph (DAG)
 * using an in-memory Virtual File System (VFS) to simulate blobs, trees, and commits.
 *
 * We use SubtleCrypto (SHA-1) to generate realistic content-addressable hashes, ensuring
 * the user experiences the true immutability and cryptographic nature of Git operations.
 */
import { FileSystem } from "../vfs/FileSystem";
import {
  GitObject,
  GitObjectType,
  GitCommit,
  GitTreeEntry,
  ReflogEntry,
} from "./types";
import { matchesPattern } from "./GitUtils";
import { GitCore } from "./GitCore";
import { GitRemote } from "./GitRemote";

export class GitRepository {
  private objects: Map<string, GitObject> = new Map();
  private refs: Map<string, string> = new Map(); // branch name -> commit hash
  private head: string = "master"; // current branch or detached commit hash
  private index: Map<string, string> = new Map(); // path -> blob hash
  private reflog: ReflogEntry[] = [];
  private remotes: Map<string, Map<string, string>> = new Map(); // remote name -> { branch -> hash }
  private core: GitCore;
  private sync: GitRemote;

  // Bisect state for Level 15
  private bisectActive: boolean = false;
  private bisectBad: string | null = null;
  private bisectGood: string | null = null;
  private bisectRange: string[] = [];

  // Worktree state for Level 18
  private worktrees: Array<{ path: string; branch: string }> = [
    { path: "/repo", branch: "master" },
  ];

  // Config state for Level 19
  private config: Map<string, string> = new Map();

  constructor(private fs: FileSystem) {
    this.remotes.set("origin", new Map());
    this.core = new GitCore(this.fs, this.objects);
    this.sync = new GitRemote(this.refs, this.remotes, (r, oh, nh, m) =>
      this.addToReflog(r, oh, nh, m),
    );
  }

  public init(): void {
    if (this.refs.size > 0) return;
    this.refs.set("master", "");
    this.addToReflog("HEAD", null, "", "initial pull");
  }

  private isIgnored(path: string): boolean {
    if (!this.fs.exists("/.gitignore")) return false;
    try {
      const ignoreContent = this.fs.readFile("/.gitignore");
      const patterns = ignoreContent
        .split("\n")
        .map((p: string) => p.trim())
        .filter((p: string) => p && !p.startsWith("#"));
      return matchesPattern(path, patterns);
    } catch (e) {
      return false;
    }
  }

  public async hashObject(
    content: string,
    type: GitObjectType = "blob",
    store: boolean = true,
  ): Promise<string> {
    return await this.core.hashObject(content, type, store);
  }

  public getObject(hash: string): GitObject | undefined {
    return this.objects.get(hash);
  }

  public async add(path: string): Promise<void> {
    if (!this.fs.exists(path)) throw new Error(`Path does not exist: ${path}`);
    if (this.fs.isDirectory(path)) {
      const files = this.fs.ls(path);
      for (const file of files) {
        await this.add(`${path === "/" ? "" : path}/${file}`);
      }
      return;
    }
    if (this.isIgnored(path))
      throw new Error(`The following paths are ignored: ${path}`);
    const content = this.fs.readFile(path);
    const hash = await this.hashObject(content);
    this.index.set(path, hash);
  }

  public async commit(
    message: string,
    author: string,
    signature?: string,
  ): Promise<string> {
    if (this.index.size === 0)
      throw new Error('Nothing to commit (use "git add" first)');
    const rootTreeHash = await this.core.writeTree(this.index);
    const parentHash = this.refs.get(this.head) || null;
    const commitData: GitCommit = {
      tree: rootTreeHash,
      parent: parentHash,
      author,
      message,
      timestamp: Date.now(),
      signature,
    };
    const commitHash = await this.hashObject(
      JSON.stringify(commitData),
      "commit",
    );
    const oldHash = this.refs.get(this.head) || null;
    this.refs.set(this.head, commitHash);
    this.addToReflog(this.head, oldHash, commitHash, `commit: ${message}`);
    this.index.clear();
    return commitHash;
  }

  private addToReflog(
    ref: string,
    oldHash: string | null,
    newHash: string,
    message: string,
  ): void {
    this.reflog.push({ ref, oldHash, newHash, message, timestamp: Date.now() });
  }

  public getReflog(): ReflogEntry[] {
    return [...this.reflog].reverse();
  }
  public getHead(): string {
    return this.head;
  }
  public getCurrentCommit(): string | null {
    return this.refs.get(this.head) || null;
  }

  public async branch(name: string): Promise<void> {
    if (this.refs.has(name)) throw new Error(`Branch already exists: ${name}`);
    const currentCommit = this.getCurrentCommit();
    this.refs.set(name, currentCommit || "");
    this.addToReflog(
      name,
      null,
      currentCommit || "",
      `branch: Created from ${this.head}`,
    );
  }

  public checkout(name: string): void {
    if (this.refs.has(name)) {
      this.head = name;
      this.addToReflog(
        "HEAD",
        this.refs.get(this.head) || null,
        this.refs.get(name) || "",
        `checkout: moving to ${name}`,
      );
    } else if (
      this.objects.has(name) &&
      this.objects.get(name)?.type === "commit"
    ) {
      const oldHead = this.head;
      this.head = name;
      this.addToReflog(
        "HEAD",
        oldHead,
        name,
        `checkout: moving to ${name.substring(0, 7)} (detached)`,
      );
    } else {
      throw new Error(`error: pathspec '${name}' did not match any files`);
    }
  }

  public async reset(
    target: string,
    mode: "hard" | "soft" = "hard",
  ): Promise<void> {
    let targetHash = this.refs.get(target) || target;
    if (!this.objects.has(targetHash))
      throw new Error(`fatal: ambiguous argument '${target}'`);
    const oldHash = this.refs.get(this.head) || null;
    this.refs.set(this.head, targetHash);
    if (mode === "hard") {
      this.index.clear();
      await this.core.restoreStateFromCommit(targetHash);
    }
    this.addToReflog(
      this.head,
      oldHash,
      targetHash,
      `reset: moving to ${target}`,
    );
  }

  public async revert(target: string, author: string): Promise<string> {
    if (!this.objects.has(target))
      throw new Error(`fatal: bad revision '${target}'`);
    const commitData = JSON.parse(this.objects.get(target)!.data) as GitCommit;
    if (!commitData.parent) throw new Error("fatal: cannot revert root commit");
    await this.core.restoreStateFromCommit(commitData.parent);
    this.index.clear();
    const parentCommit = JSON.parse(
      this.objects.get(commitData.parent)!.data,
    ) as GitCommit;
    const parentTree = JSON.parse(
      this.objects.get(parentCommit.tree)!.data,
    ) as GitTreeEntry[];
    for (const entry of parentTree) this.index.set(entry.name, entry.hash);
    return await this.commit(`revert: ${commitData.message}`, author);
  }

  public async merge(
    sourceBranch: string,
    author: string,
  ): Promise<{ status: "ff" | "merged" | "conflict"; hash?: string }> {
    const targetHash = this.refs.get(sourceBranch);
    const currentHash = this.refs.get(this.head);
    if (!targetHash)
      throw new Error(`fatal: ${sourceBranch} is not a valid branch`);
    if (!currentHash) {
      this.refs.set(this.head, targetHash);
      return { status: "ff", hash: targetHash };
    }
    const currentTree = await this.core.getTreeEntries(currentHash);
    const targetTree = await this.core.getTreeEntries(targetHash);
    const conflicts: string[] = [];
    const mergedIndex = new Map(this.index);
    for (const targetEntry of targetTree) {
      const currentEntry = currentTree.find((e) => e.name === targetEntry.name);
      if (currentEntry && currentEntry.hash !== targetEntry.hash)
        conflicts.push(targetEntry.name);
      else mergedIndex.set(targetEntry.name, targetEntry.hash);
    }
    if (conflicts.length > 0) {
      for (const file of conflicts) {
        const conflictMarker = `<<<<<<< HEAD\n${this.fs.readFile(file)}\n=======\n${this.objects.get(targetTree.find((e) => e.name === file)!.hash)?.data || ""}\n>>>>>>> ${sourceBranch}`;
        this.fs.writeFile(file, conflictMarker);
      }
      return { status: "conflict" };
    }
    this.index = mergedIndex;
    return {
      status: "merged",
      hash: await this.commit(
        `merge: branch '${sourceBranch}' into ${this.head}`,
        author,
      ),
    };
  }

  public getGraph(): {
    commits: (GitCommit & { hash: string })[];
    branches: { name: string; hash: string }[];
  } {
    const allCommits = new Map<string, GitCommit & { hash: string }>();
    const branches: { name: string; hash: string }[] = [];
    for (const [name, hash] of this.refs.entries()) {
      branches.push({ name, hash });
      let currentHash: string | null = hash;
      while (currentHash) {
        if (allCommits.has(currentHash)) break;
        const obj = this.objects.get(currentHash);
        if (obj && obj.type === "commit") {
          const commitData = JSON.parse(obj.data) as GitCommit;
          allCommits.set(currentHash, { ...commitData, hash: currentHash });
          currentHash = commitData.parent;
        } else break;
      }
    }
    return {
      commits: Array.from(allCommits.values()).sort(
        (a, b) => b.timestamp - a.timestamp,
      ),
      branches,
    };
  }

  public getBranches(): Map<string, string> {
    return new Map(this.refs);
  }
  public getRemoteBranches(remote: string = "origin"): Map<string, string> {
    return new Map(this.remotes.get(remote) || new Map());
  }

  public async push(remote: string, branch: string): Promise<void> {
    return await this.sync.push(remote, branch);
  }

  public async fetch(remote: string): Promise<void> {
    return await this.sync.fetch(remote);
  }

  public setConfig(key: string, value: string): void {
    this.config.set(key, value);
  }

  public getConfig(key: string): string | undefined {
    return this.config.get(key);
  }

  public getWorktrees(): Array<{ path: string; branch: string }> {
    return [...this.worktrees];
  }

  public async addWorktree(path: string, branch: string): Promise<void> {
    if (this.worktrees.some((wt) => wt.path === path)) {
      throw new Error(`fatal: worktree already exists at '${path}'`);
    }
    if (!this.refs.has(branch)) {
      await this.branch(branch);
    }
    this.worktrees.push({ path, branch });
    this.addToReflog("HEAD", null, this.refs.get(branch) || "", `worktree: add ${path}`);
  }

  /**
   * Bisect Simulation Engine
   * Orchestrates the binary search process through the DAG history.
   */
  public async bisect(
    action: "start" | "good" | "bad" | "reset",
    target?: string,
  ): Promise<string> {
    if (action === "reset") {
      this.bisectActive = false;
      this.bisectRange = [];
      this.checkout("master");
      return "✓ Bisect reset complete. Returned to master.";
    }

    if (action === "start") {
      this.bisectActive = true;
      this.bisectRange = this.getGraph().commits.map((c) => c.hash).reverse();
      this.bisectBad = this.getCurrentCommit();
      return "✓ Bisect started. Waiting for 'bad' and 'good' markers.";
    }

    if (!this.bisectActive)
      throw new Error("fatal: bisect not active. run 'git bisect start'");

    const currentHash = target || this.getCurrentCommit();
    if (!currentHash)
      throw new Error("fatal: could not identify current commit");

    if (action === "bad") this.bisectBad = currentHash;
    if (action === "good") this.bisectGood = currentHash;

    // Calculate new range
    const badIdx = this.bisectRange.indexOf(this.bisectBad!);
    const goodIdx = this.bisectGood
      ? this.bisectRange.indexOf(this.bisectGood)
      : -1;

    const subRange = this.bisectRange.slice(goodIdx + 1, badIdx + 1);

    if (subRange.length <= 1) {
      this.bisectActive = false;
      return `✓ ${this.bisectBad?.substring(0, 7)} is the first bad commit.`;
    }

    const midIdx = Math.floor(subRange.length / 2);
    const midHash = subRange[midIdx];
    this.checkout(midHash);

    return `Bisecting: ${subRange.length} revisions left to test after this (roughly ${Math.ceil(Math.log2(subRange.length))} steps)`;
  }
}
