import { execa, type ResultPromise } from 'execa';
import { Process } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

export class ProcessManager {
  private processes = new Map<string, { info: Process; controller: ResultPromise<any> }>();

  spawn(cmd: string, args: string[] = []): Process {
    const id = uuidv4();
    const child = execa(cmd, args, { reject: false });
    
    const processInfo: Process = {
      id,
      command: `${cmd} ${args.join(' ')}`.trim(),
      pid: child.pid,
      status: 'running',
      startedAt: new Date()
    };

    this.processes.set(id, { info: processInfo, controller: child });

    child.then((result) => {
      processInfo.status = result.exitCode === 0 ? 'completed' : 'failed';
    }).catch(() => {
      processInfo.status = 'failed';
    });

    return processInfo;
  }

  kill(id: string): boolean {
    const proc = this.processes.get(id);
    if (proc && proc.info.status === 'running') {
      proc.controller.kill('SIGTERM');
      proc.info.status = 'killed';
      return true;
    }
    return false;
  }

  listRunning(): Process[] {
    return Array.from(this.processes.values())
      .map(p => p.info)
      .filter(p => p.status === 'running');
  }

  async getOutput(id: string): Promise<string> {
    const proc = this.processes.get(id);
    if (!proc) return '';
    try {
      const res = await proc.controller;
      return res.stdout || '';
    } catch (e: any) {
      return e.stdout || e.message || '';
    }
  }
}
