import { GitRepository } from "./GitRepository";
import { FileSystem } from "../vfs/FileSystem";
import { DataCommands } from "./DataCommands";
import { GitCommandHandler } from "./GitCommandHandler";

/**
 * Command Processor Engine (The Interface Layer)
 * 
 * ARCHITECTURAL PHILOSOPHY:
 * Orchestrates technical command execution across specialized handlers.
 */
export class CommandProcessor {
  private data: DataCommands;
  private gitHandler: GitCommandHandler;

  constructor(
    private fs: FileSystem,
    private git: GitRepository,
    private author: string,
  ) {
    this.data = new DataCommands(this.fs, this.git);
    this.gitHandler = new GitCommandHandler(this.fs, this.git, this.author);
  }

  public async execute(input: string): Promise<string> {
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case "ls": return this.fs.ls(args[0] || "/").join("  ");
      case "mkdir":
        if (!args[0]) return "mkdir: missing operand";
        this.fs.mkdir(args[0]);
        return "";
      case "cat":
        if (!args[0]) return "cat: missing operand";
        return this.fs.readFile(args[0]);
      case "echo":
        const quoteMatch = input.match(/echo\s+["'](.*)["']\s*>\s*(.*)/);
        if (quoteMatch) {
          this.fs.writeFile(quoteMatch[2].trim(), quoteMatch[1]);
          return "";
        }
        return args.join(" ");
      case "git": return await this.gitHandler.handle(args);
      case "help": return "Available commands: ls, mkdir, git, clear, jupytext, mlflow, sqlfluff, feast, dbt, workflow, help";
      case "clear": return "CLEAR_TERMINAL";
      case "jupytext": return this.data.handleJupytext(args);
      case "mlflow": return this.data.handleMLflow(args);
      case "sqlfluff": return this.data.handleSQLFluff(args);
      case "feast": return this.data.handleFeast(args);
      case "dbt": return this.data.handleDBT(args);
      case "workflow": return this.data.handleWorkflow(args);
      default: return `command not found: ${command}`;
    }
  }
}
