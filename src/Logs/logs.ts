import { ShellEngine } from '../Shell/shell.js';
import { CommandResult } from '../types.js';
import * as fs from 'fs';

export class LogViewer {
  private shell = new ShellEngine();

  async tail(file: string, lines: number = 10): Promise<CommandResult> {
    return this.shell.run('tail', ['-n', String(lines), file]);
  }

  watch(file: string, handler: (line: string) => void): () => void {
    const watcher = fs.watch(file, (eventType) => {
      if (eventType === 'change') {
        handler(`File ${file} changed`);
      }
    });
    return () => watcher.close();
  }

  async search(file: string, pattern: string): Promise<CommandResult> {
    return this.shell.run('grep', [pattern, file]);
  }
}
