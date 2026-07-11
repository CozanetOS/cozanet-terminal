import { execa } from 'execa';
import { CommandResult } from '../types.js';

export class ShellEngine {
  public readonly id = 'terminal:shell';

  async run(command: string, args: string[] = [], cwd?: string): Promise<CommandResult> {
    const start = Date.now();
    try {
      const result = await execa(command, args, { cwd, reject: false });
      return {
        command: `${command} ${args.join(' ')}`.trim(),
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode ?? 0,
        duration: Date.now() - start
      };
    } catch (error: any) {
      return {
        command: `${command} ${args.join(' ')}`.trim(),
        stdout: '',
        stderr: error.message || String(error),
        exitCode: error.exitCode ?? 1,
        duration: Date.now() - start
      };
    }
  }

  async runScript(script: string): Promise<CommandResult> {
    const start = Date.now();
    try {
      const result = await execa({ shell: true, reject: false })(script);
      return {
        command: script,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode ?? 0,
        duration: Date.now() - start
      };
    } catch (error: any) {
      return {
        command: script,
        stdout: '',
        stderr: error.message || String(error),
        exitCode: error.exitCode ?? 1,
        duration: Date.now() - start
      };
    }
  }

  async pipe(commands: string[][]): Promise<CommandResult> {
    const start = Date.now();
    if (commands.length === 0) {
      return { command: 'pipe', stdout: '', stderr: 'No commands to pipe', exitCode: 1, duration: 0 };
    }
    
    try {
      // Execute simple pipe sequence sequentially or using shell
      const pipeString = commands.map(cmd => cmd.join(' ')).join(' | ');
      return await this.runScript(pipeString);
    } catch (error: any) {
      return {
        command: 'pipe',
        stdout: '',
        stderr: error.message || String(error),
        exitCode: 1,
        duration: Date.now() - start
      };
    }
  }
}
