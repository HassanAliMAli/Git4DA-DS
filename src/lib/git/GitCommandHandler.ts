import { GitRepository } from "./GitRepository";
import { FileSystem } from "../vfs/FileSystem";

/**
 * Git Command Handler
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Handles the high-fidelity simulation of the Git CLI subcommands.
 * Isolated from the main CommandProcessor to maintain modularity.
 */
export class GitCommandHandler {
  constructor(
    private fs: FileSystem,
    private git: GitRepository,
    private author: string
  ) {}

  public async handle(args: string[]): Promise<string> {
    const subCommand = args[0];
    const subArgs = args.slice(1);

    switch (subCommand) {
      case "init":
        this.git.init();
        return "Initialized empty Git repository in /";

      case "status":
        const head = this.git.getHead();
        const commit = this.git.getCurrentCommit();
        return `On branch ${head}\n${commit ? "" : "No commits yet"}\n\nNothing to commit, working tree clean`;

      case "add":
        if (!subArgs[0]) return "Nothing specified, nothing added.";
        await this.git.add(subArgs[0]);
        return "";

      case "commit":
        const msgFlagIdx = subArgs.indexOf("-m");
        if (msgFlagIdx === -1 || !subArgs[msgFlagIdx + 1]) return "Aborting commit due to empty commit message.";
        const message = subArgs[msgFlagIdx + 1].replace(/['"]/g, "");

        let signature: string | undefined = undefined;
        if (subArgs.includes("-S")) {
          signature = this.git.getConfig("user.signingkey");
          if (!signature) return "error: gpg: no default secret key. ensure user.signingkey is configured.";
        }

        const hash = await this.git.commit(message, this.author, signature);
        return `[master (root-commit) ${hash.substring(0, 7)}] ${message}\n 1 file changed${signature ? "\n✓ GPG: VALID SIGNATURE" : ""}`;

      case "log":
        const history = this.git.getGraph().commits;
        if (history.length === 0) return "fatal: your current branch master does not have any commits yet";
        return history.map(c => `commit ${c.hash}\nAuthor: ${c.author}\nDate: ${new Date(c.timestamp).toLocaleString()}\n\n    ${c.message}`).join("\n\n");

      case "checkout":
        if (!subArgs[0]) return "fatal: checkout requires a branch name or commit hash";
        this.git.checkout(subArgs[0]);
        return `Switched to ${this.git.getBranches().has(subArgs[0]) ? "branch" : "detached commit"} '${subArgs[0]}'`;

      case "config":
        if (subArgs.includes("--global")) {
          const key = subArgs[subArgs.indexOf("--global") + 1];
          const value = subArgs[subArgs.indexOf("--global") + 2];
          if (key && value) {
            this.git.setConfig(key, value);
            return "";
          }
        }
        return "usage: git config --global <key> <value>";

      case "branch":
        if (!subArgs[0]) {
          const branches = Array.from(this.git.getBranches().keys());
          const head = this.git.getHead();
          return branches.map(b => `${b === head ? "*" : " "} ${b}`).join("\n");
        }
        await this.git.branch(subArgs[0]);
        return "";

      case "reset":
        const mode = subArgs.includes("--hard") ? "hard" : "soft";
        const target = subArgs.find(a => !a.startsWith("--")) || "HEAD";
        await this.git.reset(target, mode);
        return `HEAD is now at ${target}`;

      case "reflog":
        const entries = this.git.getReflog();
        if (entries.length === 0) return "";
        return entries.map((e, idx) => `${e.newHash?.substring(0, 7) || "0000000"} HEAD@{${idx}}: ${e.message}`).join("\n");

      case "revert":
        if (!subArgs[0]) return "fatal: revert requires a commit hash";
        const revertHash = await this.git.revert(subArgs[0], this.author);
        return `[master ${revertHash.substring(0, 7)}] revert: ...\n 1 file changed`;

      case "push":
        const pushRemote = subArgs[0] || "origin";
        const pushBranch = subArgs[1] || this.git.getHead();
        await this.git.push(pushRemote, pushBranch);
        const currentHash = this.git.getCurrentCommit()?.substring(0, 7) || "0000000";
        return `Enumerating objects: 3, done.\nWriting objects: 100% (3/3), done.\nTo ${pushRemote}\n   ${currentHash}..${currentHash}  ${pushBranch} -> ${pushBranch}`;

      case "fetch":
        const fetchRemote = subArgs[0] || "origin";
        await this.git.fetch(fetchRemote);
        return `From ${fetchRemote}\n * [new branch]      master     -> origin/master`;

      case "merge":
        if (!subArgs[0]) return "fatal: merge requires a branch name";
        const mergeResult = await this.git.merge(subArgs[0], this.author);
        if (mergeResult.status === "conflict") return `CONFLICT (content): Merge conflict in files\nAutomatic merge failed; fix conflicts and commit.`;
        return `Updating ...\nFast-forward\n 1 file changed`;

      case "rebase":
        if (subArgs.includes("-i") || subArgs.includes("--interactive")) return "SIGNAL:OPEN_REBASE";
        return "usage: git rebase -i <base>";

      case "bisect":
        const bisectAction = subArgs[0];
        if (["start", "good", "bad", "reset"].includes(bisectAction)) return await this.git.bisect(bisectAction as any);
        return "usage: git bisect <start|good|bad|reset>";

      case "filter-repo":
        if (subArgs.includes("--path") && subArgs.includes("--invert-paths")) {
          const path = subArgs[subArgs.indexOf("--path") + 1];
          if (!path) return "error: filter-repo --path requires a target";
          if (this.fs.exists(path)) this.fs.rm(path);
          return `✓ Rewrote history: 100% complete.\n✓ Obliterated ${path} from registry snapshots.`;
        }
        return "usage: git filter-repo --path <path> --invert-paths";

      case "worktree":
        if (subCommand === "worktree") {
          if (subArgs[0] === "add") {
            const path = subArgs[1];
            const branch = subArgs[2];
            if (!path || !branch) return "usage: git worktree add <path> <branch>";
            await this.git.addWorktree(path, branch);
            return `✓ Successfully created parallel workspace at ${path}`;
          }
          if (subArgs[0] === "list") return this.git.getWorktrees().map(wt => `${wt.path.padEnd(30)} ${wt.branch}`).join("\n");
        }
        return "usage: git worktree <add|list>";

      case "sparse-checkout":
        if (subArgs[0] === "set") {
          const path = subArgs[1];
          if (!path) return "error: sparse-checkout set requires a path";
          return `✓ Restricted focus to: ${path}`;
        }
        return "usage: git sparse-checkout set <path>";

      case "pr":
        if (subArgs[0] === "open") return "SIGNAL:OPEN_PR";
        return "usage: git pr open";

      default:
        return `git: '${subCommand}' is not a git command.`;
    }
  }
}
