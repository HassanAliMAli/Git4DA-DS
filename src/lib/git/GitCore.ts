import { FileSystem } from "../vfs/FileSystem";
import {
  GitObject,
  GitObjectType,
  GitCommit,
  GitTreeEntry,
} from "./types";
import { calculateHash } from "./GitUtils";

/**
 * Git Core Engine (Internal)
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * This class handles the low-level object database operations and VFS synchronization.
 * It is responsible for the 'plumbing' of Git: hashing, object storage, and tree serialization.
 */
export class GitCore {
  constructor(
    private fs: FileSystem,
    private objects: Map<string, GitObject>
  ) {}

  /**
   * Internal factory for content-addressable objects.
   * Uses SHA-1 simulation to generate immutable hashes.
   */
  public async hashObject(
    content: string,
    type: GitObjectType = "blob",
    store: boolean = true,
  ): Promise<string> {
    const hash = await calculateHash(type, content);
    if (store) {
      this.objects.set(hash, { hash, type, data: content });
    }
    return hash;
  }

  /**
   * Serializes the current staging index into a tree object.
   */
  public async writeTree(index: Map<string, string>): Promise<string> {
    const entries: GitTreeEntry[] = [];
    for (const [path, hash] of index.entries()) {
      entries.push({ name: path, hash, type: "blob" });
    }
    return await this.hashObject(JSON.stringify(entries), "tree");
  }

  /**
   * Extracts file contents from a specific commit hash and hydrates the VFS.
   */
  public async restoreStateFromCommit(hash: string): Promise<void> {
    const obj = this.objects.get(hash);
    if (!obj || obj.type !== 'commit') return;
    
    const commitData = JSON.parse(obj.data) as GitCommit;
    const treeObj = this.objects.get(commitData.tree);
    if (!treeObj) return;

    const entries = JSON.parse(treeObj.data) as GitTreeEntry[];
    for (const entry of entries) {
      const blob = this.objects.get(entry.hash);
      if (blob) this.fs.writeFile(entry.name, blob.data);
    }
  }

  /**
   * Helper to retrieve flattened tree entries for a given commit.
   */
  public async getTreeEntries(commitHash: string): Promise<GitTreeEntry[]> {
    const commitObj = this.objects.get(commitHash);
    if (!commitObj) return [];
    const commitData = JSON.parse(commitObj.data) as GitCommit;
    const treeObj = this.objects.get(commitData.tree);
    return treeObj ? (JSON.parse(treeObj.data) as GitTreeEntry[]) : [];
  }
}
