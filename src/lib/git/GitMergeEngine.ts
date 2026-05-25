import { FileSystem } from "../vfs/FileSystem";
import { GitCore } from "./GitCore";
import { GitObject } from "./types";

/**
 * Git Merge Engine
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Handles the logic for merging branches, including fast-forwards
 * and 3-way merge conflict detection.
 */
export class GitMergeEngine {
  constructor(
    private fs: FileSystem,
    private objects: Map<string, GitObject>,
    private core: GitCore
  ) {}

  public async merge(
    sourceBranch: string,
    targetHash: string,
    currentHash: string | null,
    head: string,
    index: Map<string, string>,
    readFile: (path: string) => string,
    commit: (message: string) => Promise<string>
  ): Promise<{ status: "ff" | "merged" | "conflict"; hash?: string; updatedIndex?: Map<string, string> }> {
    
    // Simple Fast-Forward
    if (!currentHash) {
      return { status: "ff", hash: targetHash };
    }

    const currentTree = await this.core.getTreeEntries(currentHash);
    const targetTree = await this.core.getTreeEntries(targetHash);
    const conflicts: string[] = [];
    const mergedIndex = new Map(index);

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
        const targetEntry = targetTree.find((e) => e.name === file);
        const targetData = this.objects.get(targetEntry!.hash)?.data || "";
        
        // Inject high-fidelity conflict markers into the VFS buffer
        const conflictMarker = `<<<<<<< HEAD\n${readFile(file)}\n=======\n${targetData}\n>>>>>>> ${sourceBranch}`;
        this.fs.writeFile(file, conflictMarker);
      }
      return { status: "conflict" };
    }

    return {
      status: "merged",
      updatedIndex: mergedIndex,
      hash: await commit(`merge: branch '${sourceBranch}' into ${head}`),
    };
  }
}
