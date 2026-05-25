import { FileSystem } from "../vfs/FileSystem";
import { GitCore } from "./GitCore";
import { GitCommit } from "./types";
import { matchesPattern } from "./GitUtils";

/**
 * Git Operation Engine
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Centralizes standard Git operations (add, commit, branch, reset, revert).
 * Decouples the logic from the high-level repository orchestrator.
 */
export class GitOperationEngine {
  constructor(
    private fs: FileSystem,
    private core: GitCore,
    private objects: Map<string, any>
  ) {}

  public isIgnored(path: string): boolean {
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

  public async add(path: string, index: Map<string, string>): Promise<void> {
    if (!this.fs.exists(path)) throw new Error(`Path does not exist: ${path}`);
    
    if (this.fs.isDirectory(path)) {
      const files = this.fs.ls(path);
      for (const file of files) {
        await this.add(`${path === "/" ? "" : path}/${file}`, index);
      }
      return;
    }

    if (this.isIgnored(path))
      throw new Error(`The following paths are ignored: ${path}`);

    const content = this.fs.readFile(path);
    const hash = await this.core.hashObject(content);
    index.set(path, hash);
  }

  public async commit(
    message: string,
    author: string,
    index: Map<string, string>,
    head: string,
    refs: Map<string, string>,
    signature?: string
  ): Promise<{ commitHash: string; oldHash: string | null }> {
    if (index.size === 0)
      throw new Error('Nothing to commit (use "git add" first)');

    const rootTreeHash = await this.core.writeTree(index);
    const parentHash = refs.get(head) || null;
    
    const commitData: GitCommit = {
      tree: rootTreeHash,
      parent: parentHash,
      author,
      message,
      timestamp: Date.now(),
      signature,
    };

    const commitHash = await this.core.hashObject(JSON.stringify(commitData), "commit");
    const oldHash = refs.get(head) || null;
    
    refs.set(head, commitHash);
    index.clear();
    return { commitHash, oldHash };
  }

  public async revert(target: string, _author: string, commit: (m: string) => Promise<string>): Promise<string> {
    const obj = this.objects.get(target);
    if (!obj) throw new Error(`fatal: bad revision '${target}'`);

    const commitData = JSON.parse(obj.data) as GitCommit;
    if (!commitData.parent) throw new Error("fatal: cannot revert root commit");

    await this.core.restoreStateFromCommit(commitData.parent);
    return await commit(`revert: ${commitData.message}`);
  }
}
