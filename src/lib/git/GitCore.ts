import { FileSystem } from "../vfs/FileSystem";
import { GitObject, GitObjectType, GitCommit, GitTreeEntry } from "./types";
import { calculateHash } from "./GitUtils";

/**
 * Git Core Engine (Internal Plumbing)
 *
 * ARCHITECTURAL PHILOSOPHY:
 * The GitCore class is the custodian of the Content-Addressable Storage (CAS) system.
 * In Git, data is not stored by filename, but by its cryptographic hash (SHA-1). 
 * This ensures:
 * 1. Immutability: Once an object is hashed, its contents can never change without
 *    changing its hash.
 * 2. Deduplication: Two identical files will share the same hash and thus 
 *    the same physical storage in our Map.
 *
 * This class handles low-level 'Plumbing' operations:
 * - Hashing (Blobs/Trees/Commits)
 * - Object Database (ODB) storage
 * - VFS Reconstruction (Hydrating the workspace from a hash)
 */
export class GitCore {
  /**
   * @param fs Reference to the active Virtual File System
   * @param objects Reference to the shared Git Object Database (Map)
   */
  constructor(
    private fs: FileSystem,
    private objects: Map<string, GitObject>,
  ) {}

  /**
   * CAS Factory: Converts raw content into a GitObject.
   * Mirrors the 'git hash-object' behavior.
   * 
   * @param content The raw data (stringified JSON or text)
   * @param type The object type (blob | tree | commit)
   * @param store If true, persists the object to the ODB Map
   * @returns The generated SHA-1 hash string
   */
  public async hashObject(
    content: string,
    type: GitObjectType = "blob",
    store: boolean = true,
  ): Promise<string> {
    const hash = await calculateHash(type, content);
    if (store) {
      // Persistence into the in-memory Object Database
      this.objects.set(hash, { hash, type, data: content });
    }
    return hash;
  }

  /**
   * Index Serialization: Converts the Staging Area into a Tree Object.
   * Mirrors 'git write-tree'.
   * 
   * @param index Map of path -> hash for staged changes
   * @returns The hash of the newly created tree object
   */
  public async writeTree(index: Map<string, string>): Promise<string> {
    const entries: GitTreeEntry[] = [];
    for (const [path, hash] of index.entries()) {
      // In a real Git, this would recurse for subdirectories.
      // For the simulation, we maintain a flat index of paths for simplicity.
      entries.push({ name: path, hash, type: "blob" });
    }
    return await this.hashObject(JSON.stringify(entries), "tree");
  }

  /**
   * Workspace Rehydration: Reconstructs the VFS from a historical snapshot.
   * Mirrors 'git checkout' or 'git reset' restoration behavior.
   * 
   * @param hash The commit hash to restore from
   */
  public async restoreStateFromCommit(hash: string): Promise<void> {
    const obj = this.objects.get(hash);
    // Boundary check: Ensure we only attempt restoration from a valid commit
    if (!obj || obj.type !== "commit") return;

    const commitData = JSON.parse(obj.data) as GitCommit;
    const treeObj = this.objects.get(commitData.tree);
    if (!treeObj) return;

    const entries = JSON.parse(treeObj.data) as GitTreeEntry[];
    for (const entry of entries) {
      // Find the binary content (blob) in our ODB
      const blob = this.objects.get(entry.hash);
      if (blob) {
        // Hydrate the Virtual File System
        this.fs.writeFile(entry.name, blob.data);
      }
    }
  }

  /**
   * Tree Introspection: Flattens a commit's tree into an array of entries.
   * 
   * @param commitHash Target commit
   * @returns Array of name/hash/type metadata for all files in the snapshot
   */
  public async getTreeEntries(commitHash: string): Promise<GitTreeEntry[]> {
    const commitObj = this.objects.get(commitHash);
    if (!commitObj) return [];
    
    // Safety parse: All GitObjects stored in CAS are string-buffered JSON
    const commitData = JSON.parse(commitObj.data) as GitCommit;
    const treeObj = this.objects.get(commitData.tree);
    
    return treeObj ? (JSON.parse(treeObj.data) as GitTreeEntry[]) : [];
  }
}
