import { ShellEngine } from '../Shell/shell.js';
import { CommandResult } from '../types.js';

export class CommandLibrary {
  private shell: ShellEngine;

  constructor() {
    this.shell = new ShellEngine();
  }

  async execute(name: string, args: Record<string, string> = {}): Promise<CommandResult> {
    switch (name) {
      case 'git status':
        return this.shell.run('git', ['status']);
      case 'npm install':
        return this.shell.run('npm', ['install']);
      case 'ls':
        const path = args.path ? [args.path] : [];
        return this.shell.run('ls', ['-la', ...path]);
      case 'cat':
        if (!args.file) {
          return { command: 'cat', stdout: '', stderr: 'Missing file argument', exitCode: 1, duration: 0 };
        }
        return this.shell.run('cat', [args.file]);
      case 'pwd':
        return this.shell.run('pwd');
      default:
        return {
          command: name,
          stdout: '',
          stderr: `Command '${name}' is not in the pre-built safe commands library.`,
          exitCode: 127,
          duration: 0
        };
    }
  }
}
