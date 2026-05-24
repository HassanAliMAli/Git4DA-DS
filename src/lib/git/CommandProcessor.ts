import { GitRepository } from "./GitRepository";
import { FileSystem } from "../vfs/FileSystem";
import { DataCommands } from "./DataCommands";

/**
 * Command Processor Engine (The Interface Layer)
 *
 * ARCHITECTURAL PHILOSOPHY:
 * The CommandProcessor acts as the semantic translation layer between the raw terminal
 * strings and the underlying logic of the Git/VFS engines.
 * 
 * It implements three primary stages:
 * 1. Lexical Parsing: Tokenizing the user's input into commands, subcommands, and flags.
 * 2. Execution Routing: Mapping tokens to specific engine methods (FileSystem, Git, or DataTools).
 * 3. Output Synthesis: Formatting raw results into strings that mimic the high-fidelity
 *    experience of a real Bash terminal.
 */
export class CommandProcessor {
  /**
   * Internal reference to specialized data engineering command handlers.
   */
  private data: DataCommands;

  /**
   * @param fs Active Virtual File System instance
   * @param git Active Git DAG engine instance
   * @param author The identity of the current operative (for commit metadata)
   */
  constructor(
    private fs: FileSystem,
    private git: GitRepository,
    private author: string,
  ) {
    this.data = new DataCommands(this.fs, this.git);
  }

  /**
   * Entry Point: Orchestrates the execution of a raw terminal string.
   * 
   * @param input The raw string from the terminal input field
   * @returns A Promise resolving to the stdout/stderr string or a special UI Signal.
   */
  public async execute(input: string): Promise<string> {
    // Basic tokenization: splitting by whitespace
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      // --- POSIX System Commands ---
      
      case "ls":
        // Lists the contents of the VFS at the target or root
        return this.fs.ls(args[0] || "/").join("  ");

      case "mkdir":
        // Creates a new directory in the ephemeral VFS
        if (!args[0]) return "mkdir: missing operand";
        this.fs.mkdir(args[0]);
        return "";

      case "cat":
        // Extracts and prints the string buffer from a VFS file
        if (!args[0]) return "cat: missing operand";
        return this.fs.readFile(args[0]);

      case "echo":
        /**
         * Redirection Engine: 
         * Parses 'echo "text" > file' patterns to write to the VFS.
         */
        const quoteMatch = input.match(/echo\s+["'](.*)["']\s*>\s*(.*)/);
        if (quoteMatch) {
          this.fs.writeFile(quoteMatch[2].trim(), quoteMatch[1]);
          return "";
        }
        return args.join(" ");

      case "git":
        // Routes the command to the specialized Git handler
        return await this.handleGit(args);

      case "help":
        return "Available commands: ls, mkdir, git, clear, jupytext, mlflow, sqlfluff, feast, dbt, workflow, help";

      case "clear":
        // Returns a special signal that the TerminalPage UI intercepts
        return "CLEAR_TERMINAL";

      // --- Specialized Data Engineering Tooling (Delegated to DataCommands) ---
      
      case "jupytext": return this.data.handleJupytext(args);
      case "mlflow": return this.data.handleMLflow(args);
      case "sqlfluff": return this.data.handleSQLFluff(args);
      case "feast": return this.data.handleFeast(args);
      case "dbt": return this.data.handleDBT(args);
      case "workflow": return this.data.handleWorkflow(args);

      default:
        return `command not found: ${command}`;
    }
  }

  /**
   * Git Protocol Handler
   * 
   * Orchestrates the high-fidelity simulation of the Git CLI.
   * Maps subcommands (commit, branch, rebase) to the GitRepository engine.
   */
  private async handleGit(args: string[]): Promise<string> {
    const subCommand = args[0];
    const subArgs = args.slice(1);

    switch (subCommand) {
      case "init":
        this.git.init();
        return "Initialized empty Git repository in /";

      case "status":
        // Simulates the 'git status' output, reporting branch and commit state
        const head = this.git.getHead();
        const commit = this.git.getCurrentCommit();
        return `On branch ${head}\n${commit ? "" : "No commits yet"}\n\nNothing to commit, working tree clean`;

      case "add":
        // Stages files into the Git index
        if (!subArgs[0]) return "Nothing specified, nothing added.";
        await this.git.add(subArgs[0]);
        return "";

      case "commit":
        /**
         * Snapshot Creation Engine:
         * Parses message flags and optional GPG signing requests (-S).
         */
        const msgFlagIdx = subArgs.indexOf("-m");
        if (msgFlagIdx === -1 || !subArgs[msgFlagIdx + 1]) {
          return "Aborting commit due to empty commit message.";
        }
        const message = subArgs[msgFlagIdx + 1].replace(/['"]/g, "");

        let signature: string | undefined = undefined;
        if (subArgs.includes("-S")) {
          // GPG Verification: Ensure a signing key is present in local config
          signature = this.git.getConfig("user.signingkey");
          if (!signature) {
            return "error: gpg: no default secret key. ensure user.signingkey is configured.";
          }
        }

        const hash = await this.git.commit(message, this.author, signature);
        return `[master (root-commit) ${hash.substring(0, 7)}] ${message}\n 1 file changed${signature ? "\n✓ GPG: VALID SIGNATURE" : ""}`;

      case "log":
        // Iterates through the DAG to provide a chronological history
        const history = this.git.getGraph().commits;
        if (history.length === 0)
          return "fatal: your current branch master does not have any commits yet";
        return history
          .map(
            (c) =>
              `commit ${c.hash}\nAuthor: ${c.author}\nDate: ${new Date(c.timestamp).toLocaleString()}\n\n    ${c.message}`,
          )
          .join("\n\n");

      case "checkout":
        // Pointer transformation logic
        if (!subArgs[0])
          return "fatal: checkout requires a branch name or commit hash";
        this.git.checkout(subArgs[0]);
        return `Switched to ${this.git.getBranches().has(subArgs[0]) ? "branch" : "detached commit"} '${subArgs[0]}'`;

      case "config":
        // Simulated local configuration management
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
        // Reference enumeration and creation
        if (!subArgs[0]) {
          const branches = Array.from(this.git.getBranches().keys());
          const head = this.git.getHead();
          return branches
            .map((b) => `${b === head ? "*" : " "} ${b}`)
            .join("\n");
        }
        await this.git.branch(subArgs[0]);
        return "";

      case "reset":
        // Destruction and history-aware restoration
        const mode = subArgs.includes("--hard") ? "hard" : "soft";
        const target = subArgs.find((a) => !a.startsWith("--")) || "HEAD";
        await this.git.reset(target, mode);
        return `HEAD is now at ${target}`;

      case "reflog":
        // Audit trail retrieval
        const entries = this.git.getReflog();
        if (entries.length === 0) return "";
        return entries
          .map((e, idx) => {
            const hash = e.newHash?.substring(0, 7) || "0000000";
            return `${hash} HEAD@{${idx}}: ${e.message}`;
          })
          .join("\n");

      case "revert":
        // Surgical snapshot inversion
        if (!subArgs[0]) return "fatal: revert requires a commit hash";
        const revertHash = await this.git.revert(subArgs[0], this.author);
        return `[master ${revertHash.substring(0, 7)}] revert: ...\n 1 file changed`;

      case "push":
        // Network synchronization projection
        const pushRemote = subArgs[0] || "origin";
        const pushBranch = subArgs[1] || this.git.getHead();
        await this.git.push(pushRemote, pushBranch);
        return `Enumerating objects: 3, done.\nDelta compression using up to 12 threads\nCompressing objects: 100% (2/2), done.\nWriting objects: 100% (3/3), 320 bytes | 320.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0), pack-reused 0\nTo ${pushRemote}\n   ${this.git.getCurrentCommit()?.substring(0, 7)}..${this.git.getCurrentCommit()?.substring(0, 7)}  ${pushBranch} -> ${pushBranch}`;

      case "fetch":
        const fetchRemote = subArgs[0] || "origin";
        await this.git.fetch(fetchRemote);
        return `From ${fetchRemote}\n * [new branch]      master     -> origin/master`;

      case "merge":
        // Collision detection and reconciliation
        if (!subArgs[0]) return "fatal: merge requires a branch name";
        const mergeResult = await this.git.merge(subArgs[0], this.author);
        if (mergeResult.status === "conflict") {
          return `Auto-merging...\nCONFLICT (content): Merge conflict in files\nAutomatic merge failed; fix conflicts and then commit the result.`;
        }
        return `Updating ${this.git.getCurrentCommit()?.substring(0, 7)}..${mergeResult.hash?.substring(0, 7)}\nFast-forward\n 1 file changed`;

      case "rebase":
        // Emits a special signal to trigger the high-fidelity 'Vim' simulation UI
        if (subArgs.includes("-i") || subArgs.includes("--interactive")) {
          return "SIGNAL:OPEN_REBASE";
        }
        return "usage: git rebase -i <base>";

      case "bisect":
        // Binary search debugging engine
        const bisectAction = subArgs[0];
        if (["start", "good", "bad", "reset"].includes(bisectAction)) {
          return await this.git.bisect(bisectAction as "start" | "good" | "bad" | "reset");
        }
        return "usage: git bisect <start|good|bad|reset>";

      case "filter-repo":
        // Surgical DAG transformation for security/mass removal
        if (args.includes("--path") && args.includes("--invert-paths")) {
          const path = args[args.indexOf("--path") + 1];
          if (!path) return "error: filter-repo --path requires a target";
          if (this.fs.exists(path)) this.fs.rm(path);
          return `✓ Parsed ${this.git.getGraph().commits.length} commits.\n✓ Rewrote history: 100% complete.\n✓ Obliterated ${path} from all snapshots in the registry.`;
        }
        return "usage: git filter-repo --path <path> --invert-paths";

      case "worktree":
        // Multi-universe workspace management
        if (subArgs[0] === "add") {
          const path = subArgs[1];
          const branch = subArgs[2];
          if (!path || !branch) return "usage: git worktree add <path> <branch>";
          await this.git.addWorktree(path, branch);
          return `Preparing worktree (new branch '${branch}')\n✓ Successfully created parallel workspace at ${path}`;
        }
        if (subArgs[0] === "list") {
          return this.git.getWorktrees().map((wt) => `${wt.path.padEnd(30)} ${wt.branch}`).join("\n");
        }
        return "usage: git worktree <add|list|remove>";

      case "sparse-checkout":
        // Selective projection for Big-Tech scale repos
        if (subArgs[0] === "set") {
          const path = subArgs[1];
          if (!path) return "error: sparse-checkout set requires a target path";
          return `✓ Successfully initialized sparse-checkout.\n✓ Restricted focus to: ${path}\n✓ Dropped 1,429,203 files from working tree (simulated).`;
        }
        return "usage: git sparse-checkout <set|list|disable> <path>";

      case "pr":
        // Emits signal to trigger the Peer Review simulation UI
        if (subArgs[0] === "open") return "SIGNAL:OPEN_PR";
        return "usage: git pr <open|status|list>";

      default:
        return `git: '${subCommand}' is not a git command. See 'git --help'.`;
    }
  }
}
