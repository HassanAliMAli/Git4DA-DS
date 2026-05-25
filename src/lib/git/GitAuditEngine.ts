import { GitCommit, ReflogEntry } from "./types";

/**
 * Git Audit Engine
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Centralizes the auditing logic for the repository. 
 * Manages the Reflog and the generation of the commit graph (DAG).
 */
export class GitAuditEngine {
  private reflog: ReflogEntry[] = [];

  public addToReflog(
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

  public getGraph(
    refs: Map<string, string>,
    objects: Map<string, any>
  ): { commits: (GitCommit & { hash: string })[]; branches: { name: string; hash: string }[] } {
    const allCommits = new Map<string, GitCommit & { hash: string }>();
    const branches: { name: string; hash: string }[] = [];

    for (const [name, hash] of refs.entries()) {
      branches.push({ name, hash });
      let currentHash: string | null = hash;
      
      while (currentHash) {
        if (allCommits.has(currentHash)) break;
        const obj = objects.get(currentHash);
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
}
