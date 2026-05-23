import { FileSystem } from '../vfs/FileSystem';

export type GitObjectType = 'blob' | 'tree' | 'commit';

export interface GitObject {
  hash: string;
  type: GitObjectType;
  data: string;
}

export interface GitCommit {
  tree: string; // Hash of the root tree
  parent: string | null;
  author: string;
  message: string;
  timestamp: number;
  signature?: string; // GPG Signature
}

export interface GitTreeEntry {
  name: string;
  hash: string;
  type: 'blob' | 'tree';
}

export class GitRepository {
  private objects: Map<string, GitObject> = new Map();
  private refs: Map<string, string> = new Map(); // branch name -> commit hash
  private head: string = 'master'; // current branch or detached commit hash
  private index: Map<string, string> = new Map(); // path -> blob hash
  private reflog: { ref: string; oldHash: string | null; newHash: string; message: string; timestamp: number }[] = [];
  private remotes: Map<string, Map<string, string>> = new Map(); // remote name -> { branch -> hash }

  constructor(private fs: FileSystem) {
    this.remotes.set('origin', new Map());
  }

  public init(): void {
    if (this.refs.size > 0) return;
    this.refs.set('master', ''); // Initialize empty master branch
    this.addToReflog('HEAD', null, '', 'initial pull');
  }

  // --- Helper: Simple SHA-1-like hashing for simulation ---
  private async calculateHash(type: GitObjectType, content: string): Promise<string> {
    const data = `${type} ${content.length}\0${content}`;
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private isIgnored(path: string): boolean {
    if (!this.fs.exists('/.gitignore')) return false;
    
    try {
      const ignoreContent = this.fs.readFile('/.gitignore');
      const patterns = ignoreContent.split('\n').map((p: string) => p.trim()).filter((p: string) => p && !p.startsWith('#'));
      
      return patterns.some((pattern: string) => {
        const regexPattern = pattern
          .replace(/\./g, '\\.')
          .replace(/\*/g, '.*');
        const regex = new RegExp(`^${regexPattern}$`);
        const fileName = path.split('/').pop() || '';
        return regex.test(fileName) || regex.test(path);
      });
    } catch (e) {
      return false;
    }
  }

  // --- Object Database Operations ---
  public async hashObject(content: string, type: GitObjectType = 'blob', store: boolean = true): Promise<string> {
    const hash = await this.calculateHash(type, content);
    if (store) {
      this.objects.set(hash, { hash, type, data: content });
    }
    return hash;
  }

  public getObject(hash: string): GitObject | undefined {
    return this.objects.get(hash);
  }

  // --- Staging (Index) Operations ---
  public async add(path: string): Promise<void> {
    if (!this.fs.exists(path)) {
      throw new Error(`Path does not exist: ${path}`);
    }

    if (this.fs.isDirectory(path)) {
      const files = this.fs.ls(path);
      for (const file of files) {
        await this.add(`${path === '/' ? '' : path}/${file}`);
      }
      return;
    }

    if (this.isIgnored(path)) {
      throw new Error(`The following paths are ignored by one of your .gitignore files: ${path}`);
    }

    const content = this.fs.readFile(path);
    const hash = await this.hashObject(content);
    this.index.set(path, hash);
  }

  // --- Commit Operations ---
  public async commit(message: string, author: string, signature?: string): Promise<string> {
    if (this.index.size === 0) {
      throw new Error('Nothing to commit (create/copy files and use "git add" to track)');
    }

    const rootTreeHash = await this.writeTree();
    const parentHash = this.refs.get(this.head) || null;
    const commitData: GitCommit = {
      tree: rootTreeHash,
      parent: parentHash,
      author,
      message,
      timestamp: Date.now(),
      signature
    };

    const commitHash = await this.hashObject(JSON.stringify(commitData), 'commit');
    const oldHash = this.refs.get(this.head) || null;
    this.refs.set(this.head, commitHash);
    this.addToReflog(this.head, oldHash, commitHash, `commit: ${message}`);
    this.index.clear();

    return commitHash;
  }

  private async writeTree(): Promise<string> {
    const entries: GitTreeEntry[] = [];
    for (const [path, hash] of this.index.entries()) {
      entries.push({ name: path, hash, type: 'blob' });
    }
    return await this.hashObject(JSON.stringify(entries), 'tree');
  }

  // --- Reflog & Branching ---
  private addToReflog(ref: string, oldHash: string | null, newHash: string, message: string) {
    this.reflog.push({
      ref,
      oldHash,
      newHash,
      message,
      timestamp: Date.now()
    });
  }

  public getReflog() {
    return [...this.reflog].reverse();
  }

  public getHead(): string {
    return this.head;
  }

  public getCurrentCommit(): string | null {
    return this.refs.get(this.head) || null;
  }

  public async branch(name: string): Promise<void> {
    if (this.refs.has(name)) {
      throw new Error(`Branch already exists: ${name}`);
    }
    const currentCommit = this.getCurrentCommit();
    this.refs.set(name, currentCommit || '');
    this.addToReflog(name, null, currentCommit || '', `branch: Created from ${this.head}`);
  }

  public checkout(name: string): void {
    if (this.refs.has(name)) {
      this.head = name;
      this.addToReflog('HEAD', this.refs.get(this.head) || null, this.refs.get(name) || '', `checkout: moving from ${this.head} to ${name}`);
    } else if (this.objects.has(name) && this.objects.get(name)?.type === 'commit') {
      const oldHead = this.head;
      this.head = name;
      this.addToReflog('HEAD', oldHead, name, `checkout: moving from ${oldHead} to ${name.substring(0, 7)} (detached)`);
    } else {
      throw new Error(`error: pathspec '${name}' did not match any file(s) known to git`);
    }
  }

  public async reset(target: string, mode: 'hard' | 'soft' = 'hard'): Promise<void> {
    let targetHash = target;
    if (this.refs.has(target)) {
      targetHash = this.refs.get(target)!;
    }

    if (!this.objects.has(targetHash)) {
      throw new Error(`fatal: ambiguous argument '${target}': unknown revision or path not in the working tree.`);
    }

    const oldHash = this.refs.get(this.head) || null;
    this.refs.set(this.head, targetHash);

    if (mode === 'hard') {
      this.index.clear();
      await this.restoreStateFromCommit(targetHash);
    }

    this.addToReflog(this.head, oldHash, targetHash, `reset: moving to ${target}`);
  }

  public async revert(target: string, author: string): Promise<string> {
    if (!this.objects.has(target)) {
      throw new Error(`fatal: bad revision '${target}'`);
    }

    const commitObj = this.objects.get(target)!;
    const commitData = JSON.parse(commitObj.data) as GitCommit;
    
    if (!commitData.parent) {
      throw new Error('fatal: cannot revert root commit');
    }

    await this.restoreStateFromCommit(commitData.parent);
    this.index.clear();
    const parentCommitObj = this.objects.get(commitData.parent)!;
    const parentCommitData = JSON.parse(parentCommitObj.data) as GitCommit;
    const treeEntries = JSON.parse(this.objects.get(parentCommitData.tree)!.data) as GitTreeEntry[];
    
    for (const entry of treeEntries) {
      this.index.set(entry.name, entry.hash);
    }

    return await this.commit(`revert: ${commitData.message}`, author);
  }

  public async merge(sourceBranch: string, author: string): Promise<{ status: 'ff' | 'merged' | 'conflict', hash?: string }> {
    const targetHash = this.refs.get(sourceBranch);
    const currentHash = this.refs.get(this.head);

    if (!targetHash) throw new Error(`fatal: ${sourceBranch} is not a valid branch`);
    if (!currentHash) {
      this.refs.set(this.head, targetHash);
      return { status: 'ff', hash: targetHash };
    }

    const currentTree = await this.getTreeEntries(currentHash);
    const targetTree = await this.getTreeEntries(targetHash);

    const conflicts: string[] = [];
    const mergedIndex = new Map(this.index);

    for (const targetEntry of targetTree) {
      const currentEntry = currentTree.find(e => e.name === targetEntry.name);
      
      if (currentEntry && currentEntry.hash !== targetEntry.hash) {
        conflicts.push(targetEntry.name);
      } else {
        mergedIndex.set(targetEntry.name, targetEntry.hash);
      }
    }

    if (conflicts.length > 0) {
      for (const file of conflicts) {
        const currentContent = this.fs.readFile(file);
        const targetObj = this.objects.get(targetTree.find(e => e.name === file)!.hash);
        const targetContent = targetObj?.data || '';
        
        const conflictMarker = `<<<<<<< HEAD\n${currentContent}\n=======\n${targetContent}\n>>>>>>> ${sourceBranch}`;
        this.fs.writeFile(file, conflictMarker);
      }
      return { status: 'conflict' };
    }

    this.index = mergedIndex;
    const mergeHash = await this.commit(`merge: branch '${sourceBranch}' into ${this.head}`, author);
    return { status: 'merged', hash: mergeHash };
  }

  private async getTreeEntries(commitHash: string): Promise<GitTreeEntry[]> {
    const commitObj = this.objects.get(commitHash);
    if (!commitObj) return [];
    const commitData = JSON.parse(commitObj.data) as GitCommit;
    const treeObj = this.objects.get(commitData.tree);
    if (!treeObj) return [];
    return JSON.parse(treeObj.data) as GitTreeEntry[];
  }

  private async restoreStateFromCommit(hash: string): Promise<void> {
    const commitObj = this.objects.get(hash);
    if (!commitObj) return;
    const commitData = JSON.parse(commitObj.data) as GitCommit;
    const treeObj = this.objects.get(commitData.tree);
    if (!treeObj) return;
    const entries = JSON.parse(treeObj.data) as GitTreeEntry[];

    for (const entry of entries) {
      const blob = this.objects.get(entry.hash);
      if (blob) {
        this.fs.writeFile(entry.name, blob.data);
      }
    }
  }

  public getGraph(): { commits: (GitCommit & { hash: string })[], branches: { name: string, hash: string }[] } {
    const allCommits = new Map<string, GitCommit & { hash: string }>();
    const branches: { name: string, hash: string }[] = [];

    for (const [name, hash] of this.refs.entries()) {
      branches.push({ name, hash });
      
      let currentHash: string | null = hash;
      while (currentHash) {
        if (allCommits.has(currentHash)) break;
        
        const obj = this.objects.get(currentHash);
        if (obj && obj.type === 'commit') {
          const commitData = JSON.parse(obj.data) as GitCommit;
          allCommits.set(currentHash, { ...commitData, hash: currentHash });
          currentHash = commitData.parent;
        } else {
          break;
        }
      }
    }

    return {
      commits: Array.from(allCommits.values()).sort((a, b) => b.timestamp - a.timestamp),
      branches
    };
  }

  public getBranches(): Map<string, string> {
    return new Map(this.refs);
  }

  public getRemoteBranches(remote: string = 'origin'): Map<string, string> {
    return new Map(this.remotes.get(remote) || new Map());
  }

  public async push(remote: string, branch: string): Promise<void> {
    const localHash = this.refs.get(branch);
    if (localHash === undefined) throw new Error(`error: src refspec ${branch} does not match any`);
    
    const remoteRefs = this.remotes.get(remote);
    if (!remoteRefs) throw new Error(`fatal: '${remote}' does not appear to be a git repository`);
    
    remoteRefs.set(branch, localHash);
    this.addToReflog(`${remote}/${branch}`, null, localHash, `push: exported from ${branch}`);
  }

  public async fetch(remote: string): Promise<void> {
    const remoteRefs = this.remotes.get(remote);
    if (!remoteRefs) throw new Error(`fatal: '${remote}' does not appear to be a git repository`);
    
    for (const [branch, hash] of remoteRefs.entries()) {
      this.addToReflog(`${remote}/${branch}`, null, hash, `fetch: from ${remote}`);
    }
  }
}
