/**
 * Git Remote Sync Engine
 *
 * ARCHITECTURAL PHILOSOPHY:
 * The GitRemote class abstracts the synchronization logic between the user's 
 * local DAG and a simulated 'Upstream' registry (Origin). 
 * 
 * In a professional Data Engineering environment, local work is irrelevant
 * until it is pushed to a shared registry. This class simulates that bridge:
 * 1. Ref Projection: It creates a projection of local branch pointers onto the 
 *    remote's reference map.
 * 2. Audit Trail: Every push and fetch event is recorded in the local Reflog,
 *    ensuring the user can track exactly when work was published.
 * 3. Atomic Updates: Ensures that remote updates are atomic—either the whole 
 *    branch is synchronized or it fails (simulated here via Map mutations).
 */
export class GitRemote {
  /**
   * @param refs Reference to the local Git branch/hash Map
   * @param remotes Multi-dimensional Map [RemoteName -> [BranchName -> Hash]]
   * @param addToReflog Callback to inject synchronization events into the local history
   */
  constructor(
    private refs: Map<string, string>,
    private remotes: Map<string, Map<string, string>>,
    private addToReflog: (
      ref: string,
      oldHash: string | null,
      newHash: string,
      message: string,
    ) => void,
  ) {}

  /**
   * Remote Synchronization (Push): Exports local branch hashes to the target remote.
   * 
   * @param remote The name of the target remote (e.g. 'origin')
   * @param branch The name of the local branch to export
   * @throws Error if the local branch doesn't exist or remote name is invalid
   */
  public async push(remote: string, branch: string): Promise<void> {
    const localHash = this.refs.get(branch);
    if (localHash === undefined) {
      throw new Error(`error: src refspec ${branch} does not match any`);
    }

    const remoteRefs = this.remotes.get(remote);
    if (!remoteRefs) throw new Error(`fatal: '${remote}' not found`);

    // Projection: Synchronize the remote pointer with our local state.
    // In our simulation, 'objects' are shared, so we only need to move the pointer.
    remoteRefs.set(branch, localHash);

    // Record the synchronization event in the local audit logs
    this.addToReflog(
      `${remote}/${branch}`,
      null,
      localHash,
      `push: exported from ${branch}`,
    );
  }

  /**
   * Remote Observation (Fetch): Downloads remote ref pointers into the local reflog.
   * Mirrors 'git fetch' behavior.
   * 
   * @param remote Target remote to audit
   * @throws Error if remote name is unrecognized
   */
  public async fetch(remote: string): Promise<void> {
    const remoteRefs = this.remotes.get(remote);
    if (!remoteRefs) throw new Error(`fatal: '${remote}' not found`);

    for (const [branch, hash] of remoteRefs.entries()) {
      // Import the remote state into our local reflog tracking
      this.addToReflog(
        `${remote}/${branch}`,
        null,
        hash,
        `fetch: from ${remote}`,
      );
    }
  }
}
