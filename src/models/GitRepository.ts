import { FileSystem } from './FileSystem';

export type GitObjectType = 'blob' | 'tree' | 'commit';

export interface GitObject {
  hash: string;
  type: GitObjectType;
  data: any;
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

  constructor(private fs: FileSystem) {}

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
      const patterns = ignoreContent.split('\n').map(p => p.trim()).filter(p => p && !p.startsWith('#'));
      
      return patterns.some(pattern => {
        // Simple glob-to-regex for .gitignore patterns
        const regexPattern = pattern
          .replace(/\./g, '\\.')
          .replace(/\*/g, '.*');
        const regex = new RegExp(`^${regexPattern}$`);
        
        // Check if the filename or the full path matches
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

    // 1. Create Tree objects from index
    const rootTreeHash = await this.writeTree();

    // 2. Create Commit object
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
    
    // 3. Update Ref
    const oldHash = this.refs.get(this.head) || null;
    this.refs.set(this.head, commitHash);
    
    // 4. Update Reflog
    this.addToReflog(this.head, oldHash, commitHash, `commit: ${message}`);

    // 5. Clear index
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
    if (!this.refs.has(name)) {
      throw new Error(`Branch not found: ${name}`);
    }
    this.head = name;
    this.addToReflog('HEAD', this.refs.get(this.head) || null, this.refs.get(name) || '', `checkout: moving from ${this.head} to ${name}`);
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
}
