export interface CommandResult {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
}

export interface Process {
  id: string;
  command: string;
  pid?: number;
  status: 'running' | 'completed' | 'failed' | 'killed';
  startedAt: Date;
}
