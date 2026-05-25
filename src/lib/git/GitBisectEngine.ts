/**
 * Git Bisect Engine
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Handles the binary search logic for locating regressions in the Git DAG.
 * This extraction keeps the main GitRepository focused on core operations.
 */
export class GitBisectEngine {
  private active: boolean = false;
  private bad: string | null = null;
  private good: string | null = null;
  private range: string[] = [];

  public start(commits: string[], currentHash: string | null): string {
    this.active = true;
    this.range = [...commits].reverse();
    this.bad = currentHash;
    return "✓ Bisect started. Waiting for 'bad' and 'good' markers.";
  }

  public reset(): { message: string; branch: string } {
    this.active = false;
    this.range = [];
    return { message: "✓ Bisect reset complete. Returned to master.", branch: "master" };
  }

  public isActive(): boolean {
    return this.active;
  }

  public execute(
    action: "good" | "bad",
    currentHash: string,
    checkout: (hash: string) => void
  ): string {
    if (action === "bad") this.bad = currentHash;
    if (action === "good") this.good = currentHash;

    const badIdx = this.range.indexOf(this.bad!);
    const goodIdx = this.good ? this.range.indexOf(this.good) : -1;
    const subRange = this.range.slice(goodIdx + 1, badIdx + 1);

    if (subRange.length <= 1) {
      this.active = false;
      return `✓ ${this.bad?.substring(0, 7)} is the first bad commit.`;
    }

    const midIdx = Math.floor(subRange.length / 2);
    const midHash = this.range[this.range.indexOf(subRange[0]) + midIdx];
    checkout(midHash);

    return `Bisecting: ${subRange.length} revisions left to test after this (roughly ${Math.ceil(Math.log2(subRange.length))} steps)`;
  }
}
