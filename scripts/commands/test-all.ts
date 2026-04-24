import fs from 'fs';
import { log } from '../utils/logger';
import { execLive } from '../utils/exec';
import { BACKEND_SERVICES, servicePath, isBackendService, BackendServiceName } from '../utils/config';

export async function testAll(args: string[]) {
  const target = args[0] || 'all';
  const ci = args.includes('--ci');

  let services: BackendServiceName[];

  if (target === 'all') {
    services = [...BACKEND_SERVICES];
  } else if (isBackendService(target)) {
    services = [target];
  } else {
    log.error(`Unknown service "${target}". Available: ${BACKEND_SERVICES.join(', ')}`);
    return;
  }

  log.header(`Testing: ${services.join(', ')}${ci ? ' (CI mode)' : ''}`);

  const results: { service: string; passed: boolean }[] = [];

  for (const svc of services) {
    const svcDir = servicePath(svc);

    if (!fs.existsSync(`${svcDir}/package.json`)) {
      log.warn(`Skipping ${svc}: no package.json`);
      results.push({ service: svc, passed: false });
      continue;
    }

    log.step(`Testing ${svc}`);

    const testCmd = ci
      ? 'npx jest --no-cache --detectOpenHandles --forceExit'
      : 'npx jest --no-cache --detectOpenHandles --watchAll=false';

    const ok = execLive(testCmd, { cwd: svcDir });
    results.push({ service: svc, passed: ok });

    if (ok) {
      log.success(`${svc} passed`);
    } else {
      log.error(`${svc} failed`);
    }
  }

  // Summary
  console.log('');
  log.header('Test Summary');
  for (const r of results) {
    if (r.passed) {
      log.success(`${r.service}`);
    } else {
      log.error(`${r.service}`);
    }
  }

  const failed = results.filter((r) => !r.passed);
  if (failed.length > 0) {
    process.exit(1);
  }
}
