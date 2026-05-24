/**
 * Git Repository Simulation Engine
 *
 * ARCHITECTURAL PHILOSOPHY:
 * The GitRepository class is the high-level orchestrator of the Git4Data simulation.
 * It provides a purely functional implementation of a Directed Acyclic Graph (DAG) 
 * for commit history, leveraging an in-memory Virtual File System (VFS).
 * 
 * Design Principles:
 * 1. Plumb & Porcelin Separation: It coordinates low-level plumbing (GitCore) 
 *    and remote synchronization (GitRemote) to provide a unified API.
 * 2. Immutable Snapshots: Every commit is a distinct point-in-time snapshot 
 *    of the VFS state, cryptographically anchored by SHA-1 hashes.
 * 3. Atomic References: Branch and HEAD movements are atomic pointer mutations
 *    in the 'refs' Map.
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
  // --- Core State Storage ---
  private objects: Map<string, GitObject> = new Map(); // The Object Database (CAS)
  private refs: Map<string, string> = new Map(); // branch name -> commit hash
  private head: string = "master"; // current branch OR detached commit hash
  private index: Map<string, string> = new Map(); // Staging Area: path -> blob hash
  private reflog: ReflogEntry[] = []; // Local audit trail of all pointer movements
  private remotes: Map<string, Map<string, string>> = new Map(); // simulated upstreams
  
  // --- Specialized Sub-Engines ---
  private core: GitCore; // Plumber for ODB and rehydration
  private sync: GitRemote; // Orchestrator for remote sync

  // --- Extended State for Advanced Challenges ---
  private bisectActive: boolean = false;
  private bisectBad: string | null = null;
  private bisectGood: string | null = null;
  private bisectRange: string[] = [];

  private worktrees: Array<{ path: string; branch: string }> = [
    { path: "/repo", branch: "master" },
  ];

  private config: Map<string, string> = new Map(); // Simulated .gitconfig

  /**
   * Initializes the engine with a reference to the active VFS.
   */
  constructor(private fs: FileSystem) {
    this.remotes.set("origin", new Map());
    this.core = new GitCore(this.fs, this.objects);
    
    // Bind synchronization to local reflog updates
    this.sync = new GitRemote(this.refs, this.remotes, (r, oh, nh, m) =>
      this.addToReflog(r, oh, nh, m),
    );
  }

  /**
   * Registry Bootloader: Sets up the initial 'master' branch.
   */
  public init(): void {
    if (this.refs.size > 0) return; // Prevent double-init
    this.refs.set("master", ""); // Initialize pointer to null origin
    this.addToReflog("HEAD", null, "", "initial pull");
  }

  /**
   * Heuristic Filter: Checks if a path should be excluded based on .gitignore.
   */
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

  // --- Public Plumbing API ---

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

  // --- Standard Git Operations ---

  /**
   * Staging Engine: Mirrors 'git add'. 
   * Recursively traverses the VFS and adds files to the Index Map.
   */
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
    this.index.set(path, hash); // Map path to immutable blob hash
  }

  /**
   * Snapshot Engine: Mirrors 'git commit'.
   * Serializes the index into a Tree, creates a Commit object, and moves the branch pointer.
   */
  public async commit(
    message: string,
    author: string,
    signature?: string,
  ): Promise<string> {
    if (this.index.size === 0)
      throw new Error('Nothing to commit (use "git add" first)');

    const rootTreeHash = await this.core.writeTree(this.index);
    const parentHash = this.refs.get(this.head) || null;
    
    // Commit Metadata Construction
    const commitData: GitCommit = {
      tree: rootTreeHash,
      parent: parentHash,
      author,
      message,
      timestamp: Date.now(),
      signature,
    };

    const commitHash = await this.hashObject(JSON.stringify(commitData), "commit");
    const oldHash = this.refs.get(this.head) || null;
    
    // Atomic pointer update
    this.refs.set(this.head, commitHash);
    
    // Audit log update
    this.addToReflog(this.head, oldHash, commitHash, `commit: ${message}`);
    
    this.index.clear(); // Commit implies clearing the staging area
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

  // --- Reference Management ---

  public getReflog(): ReflogEntry[] { return [...this.reflog].reverse(); }
  public getHead(): string { return this.head; }
  public getCurrentCommit(): string | null { return this.refs.get(this.head) || null; }

  /**
   * Pointer Management: Mirrors 'git branch'.
   * Creates a new named reference pointing to the current HEAD commit.
   */
  public async branch(name: string): Promise<void> {
    if (this.refs.has(name)) throw new Error(`Branch already exists: ${name}`);
    const currentCommit = this.getCurrentCommit();
    this.refs.set(name, currentCommit || "");
    this.addToReflog(name, null, currentCommit || "", `branch: Created from ${this.head}`);
  }

  /**
   * State Transformer: Mirrors 'git checkout'.
   * Swaps the current HEAD pointer and hydrates the VFS with the target's tree.
   */
  public checkout(name: string): void {
    if (this.refs.has(name)) {
      this.head = name;
      this.addToReflog("HEAD", this.refs.get(this.head) || null, this.refs.get(name) || "", `checkout: moving to ${name}`);
    } else if (this.objects.has(name) && this.objects.get(name)?.type === "commit") {
      // Handle Detached HEAD state
      const oldHead = this.head;
      this.head = name;
      this.addToReflog("HEAD", oldHead, name, `checkout: moving to ${name.substring(0, 7)} (detached)`);
    } else {
      throw new Error(`error: pathspec '${name}' did not match any files`);
    }
  }

  /**
   * Destructive Restoration: Mirrors 'git reset --hard'.
   * Moves the branch pointer and completely overwrites the VFS from the target snapshot.
   */
  public async reset(target: string, mode: "hard" | "soft" = "hard"): Promise<void> {
    let targetHash = this.refs.get(target) || target;
    if (!this.objects.has(targetHash)) throw new Error(`fatal: ambiguous argument '${target}'`);

    const oldHash = this.refs.get(this.head) || null;
    this.refs.set(this.head, targetHash);

    if (mode === "hard") {
      this.index.clear();
      // Overwrite the current workspace with historical logic
      await this.core.restoreStateFromCommit(targetHash);
    }

    this.addToReflog(this.head, oldHash, targetHash, `reset: moving to ${target}`);
  }

  /**
   * Surgical Inversion: Mirrors 'git revert'.
   * Creates a new commit that applies the inverse of the target's changes.
   */
  public async revert(target: string, author: string): Promise<string> {
    const obj = this.objects.get(target);
    if (!obj) throw new Error(`fatal: bad revision '${target}'`);

    const commitData = JSON.parse(obj.data) as GitCommit;
    if (!commitData.parent) throw new Error("fatal: cannot revert root commit");

    // Restoration to parent ensures we have the 'clean' state before the reverted commit
    await this.core.restoreStateFromCommit(commitData.parent);
    this.index.clear();

    const parentCommit = JSON.parse(this.objects.get(commitData.parent)!.data) as GitCommit;
    const parentTree = JSON.parse(this.objects.get(parentCommit.tree)!.data) as GitTreeEntry[];
    
    // Repopulate index from parent tree
    for (const entry of parentTree) this.index.set(entry.name, entry.hash);
    
    return await this.commit(`revert: ${commitData.message}`, author);
  }

  /**
   * Merge Engine: Orchestrates 3-way merging simulation.
   * Detects content collisions and injects standard Git conflict markers into the VFS.
   */
  public async merge(sourceBranch: string, author: string): Promise<{ status: "ff" | "merged" | "conflict"; hash?: string }> {
    const targetHash = this.refs.get(sourceBranch);
    const currentHash = this.refs.get(this.head);

    if (!targetHash) throw new Error(`fatal: ${sourceBranch} is not a valid branch`);
    
    // Simple Fast-Forward
    if (!currentHash) {
      this.refs.set(this.head, targetHash);
      return { status: "ff", hash: targetHash };
    }

    const currentTree = await this.core.getTreeEntries(currentHash);
    const targetTree = await this.core.getTreeEntries(targetHash);
    const conflicts: string[] = [];
    const mergedIndex = new Map(this.index);

    // Collision Detection Logic
    for (const targetEntry of targetTree) {
      const currentEntry = currentTree.find((e) => e.name === targetEntry.name);
      if (currentEntry && currentEntry.hash !== targetEntry.hash) {
        conflicts.push(targetEntry.name);
      } else {
        mergedIndex.set(targetEntry.name, targetEntry.hash);
      }
    }

    if (conflicts.length > 0) {
      for (const file of conflicts) {
        // Inject high-fidelity conflict markers into the VFS buffer
        const conflictMarker = `<<<<<<< HEAD\n${this.fs.readFile(file)}\n=======\n${this.objects.get(targetTree.find((e) => e.name === file)!.hash)?.data || ""}\n>>>>>>> ${sourceBranch}`;
        this.fs.writeFile(file, conflictMarker);
      }
      return { status: "conflict" };
    }

    this.index = mergedIndex;
    return {
      status: "merged",
      hash: await this.commit(`merge: branch '${sourceBranch}' into ${this.head}`, author),
    };
  }

  /**
   * DAG Walker: Generates a flattened list of all commits and active branch markers.
   * This is used by the GitGraphVisualizer to render the SVG tree.
   */
  public getGraph(): { commits: (GitCommit & { hash: string })[]; branches: { name: string; hash: string }[] } {
    const allCommits = new Map<string, GitCommit & { hash: string }>();
    const branches: { name: string; hash: string }[] = [];

    for (const [name, hash] of this.refs.entries()) {
      branches.push({ name, hash });
      let currentHash: string | null = hash;
      
      // DFS Traversal of the DAG
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
      commits: Array.from(allCommits.values()).sort((a, b) => b.timestamp - a.timestamp),
      branches,
    };
  }

  // --- Configuration & Remote Orchestration ---

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

  /**
   * Bisect Simulation Engine
   * Orchestrates the binary search process through the DAG history.
   * 
   * @param action Command action (start | good | bad | reset)
   * @param target Specific hash to mark (defaults to current commit)
   */
  public async bisect(action: "start" | "good" | "bad" | "reset", target?: string): Promise<string> {
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

    if (!this.bisectActive) throw new Error("fatal: bisect not active. run 'git bisect start'");

    const currentHash = target || this.getCurrentCommit();
    if (!currentHash) throw new Error("fatal: could not identify current commit");

    if (action === "bad") this.bisectBad = currentHash;
    if (action === "good") this.bisectGood = currentHash;

    // Binary Search Slice
    const badIdx = this.bisectRange.indexOf(this.bisectBad!);
    const goodIdx = this.bisectGood ? this.bisectRange.indexOf(this.bisectGood) : -1;
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
