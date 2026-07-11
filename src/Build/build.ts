import { ShellEngine } from '../Shell/shell.js';
import { CommandResult } from '../types.js';

export class BuildEngine {
  public readonly id = 'terminal:build';
  private shell = new ShellEngine();

  async npmInstall(dir: string): Promise<CommandResult> {
    return this.shell.run('npm', ['install'], dir);
  }

  async build(dir: string): Promise<CommandResult> {
    return this.shell.run('npm', ['run', 'build'], dir);
  }

  async test(dir: string): Promise<CommandResult> {
    return this.shell.run('npm', ['run', 'test'], dir);
  }

  async lint(dir: string): Promise<CommandResult> {
    return this.shell.run('npm', ['run', 'lint'], dir);
  }
}
