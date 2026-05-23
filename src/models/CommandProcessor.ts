import { GitRepository } from './GitRepository';
import { FileSystem } from './FileSystem';

export class CommandProcessor {
  constructor(
    private fs: FileSystem,
    private git: GitRepository,
    private author: string
  ) {}

  public async execute(input: string): Promise<string> {
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case 'ls':
        return this.fs.ls(args[0] || '/').join('  ');
      
      case 'mkdir':
        if (!args[0]) return 'usage: mkdir <directory>';
        this.fs.mkdir(args[0]);
        return '';

      case 'touch':
        if (!args[0]) return 'usage: touch <filename>';
        this.fs.writeFile(args[0], '');
        return '';

      case 'echo':
        const contentMatch = input.match(/echo\s+["'](.*)["']\s+>\s+(.*)/);
        if (contentMatch) {
          const content = contentMatch[1];
          const path = contentMatch[2].trim();
          this.fs.writeFile(path, content);
          return '';
        }
        return args.join(' ');

      case 'git':
        return await this.handleGit(args);

      case 'help':
        return 'Available commands: ls, mkdir, git, clear, help';

      case 'clear':
        return 'CLEAR_TERMINAL'; // Special signal

      default:
        return `command not found: ${command}`;
    }
  }

  private async handleGit(args: string[]): Promise<string> {
    const subCommand = args[0];
    const subArgs = args.slice(1);

    switch (subCommand) {
      case 'init':
        this.git.init();
        return 'Initialized empty Git repository in /';

      case 'status':
        const head = this.git.getHead();
        const commit = this.git.getCurrentCommit();
        return `On branch ${head}\n${commit ? '' : 'No commits yet'}\n\nNothing to commit, working tree clean`;

      case 'add':
        if (!subArgs[0]) return 'Nothing specified, nothing added.';
        await this.git.add(subArgs[0]);
        return '';

      case 'commit':
        const msgFlagIdx = subArgs.indexOf('-m');
        if (msgFlagIdx === -1 || !subArgs[msgFlagIdx + 1]) {
          return 'Aborting commit due to empty commit message.';
        }
        const message = subArgs[msgFlagIdx + 1].replace(/['"]/g, '');
        const hash = await this.git.commit(message, this.author);
        return `[master (root-commit) ${hash.substring(0, 7)}] ${message}\n 1 file changed`;

      case 'log':
        const history = this.git.getGraph().commits;
        if (history.length === 0) return 'fatal: your current branch master does not have any commits yet';
        return history.map(c => `commit ${c.hash}\nAuthor: ${c.author}\nDate: ${new Date(c.timestamp).toLocaleString()}\n\n    ${c.message}`).join('\n\n');

      default:
        return `git: '${subCommand}' is not a git command. See 'git --help'.`;
    }
  }
}
