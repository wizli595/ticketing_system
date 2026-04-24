import { log } from '../utils/logger';
import { exec } from '../utils/exec';

export async function healthCheck() {
  log.header('Cluster Health Check');

  // Check kubectl is available
  const { success: hasKubectl } = exec('kubectl version --client --short 2>/dev/null || kubectl version --client', { silent: true });
  if (!hasKubectl) {
    log.error('kubectl not found. Is it installed?');
    return;
  }

  // Pod status
  log.step('Pod Status');
  const { stdout: pods, success: podsOk } = exec(
    'kubectl get pods -o wide --no-headers 2>&1',
    { silent: true }
  );

  if (!podsOk || !pods) {
    log.error('Could not get pods. Is the cluster running?');
    return;
  }

  const lines = pods.split('\n').filter(Boolean);
  let healthy = 0;
  let unhealthy = 0;

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    const name = parts[0];
    const ready = parts[1];
    const status = parts[2];
    const restarts = parts[3];

    const isOk = status === 'Running' && !ready.startsWith('0/');
    const restartCount = parseInt(restarts, 10);

    if (isOk && restartCount === 0) {
      log.success(`${name}  ${ready}  ${status}  restarts: ${restarts}`);
      healthy++;
    } else if (isOk && restartCount > 0) {
      log.warn(`${name}  ${ready}  ${status}  restarts: ${restarts}`);
      healthy++;
    } else {
      log.error(`${name}  ${ready}  ${status}  restarts: ${restarts}`);
      unhealthy++;
    }
  }

  // Services
  console.log('');
  log.step('Services');
  const { stdout: svcs } = exec('kubectl get svc --no-headers 2>&1', { silent: true });
  if (svcs) {
    for (const line of svcs.split('\n').filter(Boolean)) {
      log.dim(`  ${line.trim()}`);
    }
  }

  // Summary
  console.log('');
  log.header('Summary');
  log.info(`${healthy} healthy, ${unhealthy} unhealthy out of ${lines.length} pods`);

  if (unhealthy > 0) {
    console.log('');
    log.step('Recent events for unhealthy pods:');
    const { stdout: events } = exec(
      'kubectl get events --sort-by=.lastTimestamp --field-selector type!=Normal 2>&1 | tail -10',
      { silent: true }
    );
    if (events) {
      log.dim(events);
    }
  }
}
