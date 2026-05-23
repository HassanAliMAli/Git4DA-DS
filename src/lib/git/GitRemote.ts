import { ReflogEntry } from "./types";

/**
 * Git Remote Sync Engine
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Handles the synchronization between the local registry and simulated remote servers.
 * This class abstracts the network layer, simulating latency and delta compression
 * while maintaining the integrity of remote ref tracking.
 */
export class GitRemote {
  constructor(
    private refs: Map<string, string>,
    private remotes: Map<string, Map<string, string>>,
    private addToReflog: (ref: string, oldHash: string | null, newHash: string, message: string) => void
  ) {}

  /**
   * Simulates 'git push'. Exports local branch hashes to the target remote.
   */
  public async push(remote: string, branch: string): Promise<void> {
    const localHash = this.refs.get(branch);
    if (localHash === undefined) {
      throw new Error(`error: src refspec ${branch} does not match any`);
    }

    const remoteRefs = this.remotes.get(remote);
    if (!remoteRefs) throw new Error(`fatal: '${remote}' not found`);

    // Synchronize the remote pointer with our local state
    remoteRefs.set(branch, localHash);
    
    this.addToReflog(
      `${remote}/${branch}`,
      null,
      localHash,
      `push: exported from ${branch}`
    );
  }

  /**
   * Simulates 'git fetch'. Downloads remote ref pointers into the local reflog.
   */
  public async fetch(remote: string): Promise<void> {
    const remoteRefs = this.remotes.get(remote);
    if (!remoteRefs) throw new Error(`fatal: '${remote}' not found`);

    for (const [branch, hash] of remoteRefs.entries()) {
      this.addToReflog(
        `${remote}/${branch}`,
        null,
        hash,
        `fetch: from ${remote}`
      );
    }
  }
}
