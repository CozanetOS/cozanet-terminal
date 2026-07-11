import { ShellEngine } from '../Shell/shell.js';
import { CommandResult } from '../types.js';

export class PackageManager {
  private shell = new ShellEngine();

  async install(pkg: string): Promise<CommandResult> {
    return this.shell.run('npm', ['install', pkg]);
  }

  async uninstall(pkg: string): Promise<CommandResult> {
    return this.shell.run('npm', ['uninstall', pkg]);
  }

  async list(): Promise<CommandResult> {
    return this.shell.run('npm', ['list', '--depth=0']);
  }

  async outdated(): Promise<CommandResult> {
    return this.shell.run('npm', ['outdated']);
  }
}
