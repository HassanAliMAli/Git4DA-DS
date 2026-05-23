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

      case 'checkout':
        if (!subArgs[0]) return 'fatal: checkout requires a branch name or commit hash';
        this.git.checkout(subArgs[0]);
        return `Switched to ${this.git.getBranches().has(subArgs[0]) ? 'branch' : 'detached commit'} '${subArgs[0]}'`;

      case 'branch':
        if (!subArgs[0]) {
          // List branches
          const branches = Array.from(this.git.getBranches().keys());
          const head = this.git.getHead();
          return branches.map(b => `${b === head ? '*' : ' '} ${b}`).join('\n');
        }
        // Create branch
        await this.git.branch(subArgs[0]);
        return '';

      case 'reset':
        const mode = subArgs.includes('--hard') ? 'hard' : 'soft';
        const target = subArgs.find(a => !a.startsWith('--')) || 'HEAD';
        await this.git.reset(target, mode);
        return `HEAD is now at ${target}`;

      case 'revert':
        if (!subArgs[0]) return 'fatal: revert requires a commit hash';
        const revertHash = await this.git.revert(subArgs[0], this.author);
        return `[master ${revertHash.substring(0, 7)}] revert: ...\n 1 file changed`;

      case 'push':
        const pushRemote = subArgs[0] || 'origin';
        const pushBranch = subArgs[1] || this.git.getHead();
        await this.git.push(pushRemote, pushBranch);
        return `Enumerating objects: 3, done.\nDelta compression using up to 12 threads\nCompressing objects: 100% (2/2), done.\nWriting objects: 100% (3/3), 320 bytes | 320.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0), pack-reused 0\nTo ${pushRemote}\n   ${this.git.getCurrentCommit()?.substring(0, 7)}..${this.git.getCurrentCommit()?.substring(0, 7)}  ${pushBranch} -> ${pushBranch}`;

      case 'fetch':
        const fetchRemote = subArgs[0] || 'origin';
        await this.git.fetch(fetchRemote);
        return `From ${fetchRemote}\n * [new branch]      master     -> origin/master`;

      case 'merge':
        if (!subArgs[0]) return 'fatal: merge requires a branch name';
        const mergeResult = await this.git.merge(subArgs[0], this.author);
        if (mergeResult.status === 'conflict') {
          return `Auto-merging...\nCONFLICT (content): Merge conflict in files\nAutomatic merge failed; fix conflicts and then commit the result.`;
        }
        return `Updating ${this.git.getCurrentCommit()?.substring(0, 7)}..${mergeResult.hash?.substring(0, 7)}\nFast-forward\n 1 file changed`;

      default:
        return `git: '${subCommand}' is not a git command. See 'git --help'.`;
    }
  }
}
