import { execSync, ExecSyncOptions } from 'child_process';
import { log } from './logger';

interface ExecResult {
  stdout: string;
  success: boolean;
}

export function exec(cmd: string, opts: ExecSyncOptions & { silent?: boolean } = {}): ExecResult {
  const { silent, ...execOpts } = opts;
  if (!silent) {
    log.dim(`$ ${cmd}`);
  }
  try {
    const stdout = execSync(cmd, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : ['pipe', 'pipe', 'pipe'],
      ...execOpts,
    }).trim();
    return { stdout, success: true };
  } catch (err: any) {
    const stderr = err.stderr?.toString().trim() || err.message;
    if (!silent) {
      log.error(stderr);
    }
    return { stdout: stderr, success: false };
  }
}

export function execLive(cmd: string, opts: ExecSyncOptions = {}): boolean {
  log.dim(`$ ${cmd}`);
  try {
    execSync(cmd, {
      stdio: 'inherit',
      ...opts,
    });
    return true;
  } catch {
    return false;
  }
}

export function gitSha(): string {
  const { stdout } = exec('git rev-parse --short HEAD', { silent: true });
  return stdout;
}
