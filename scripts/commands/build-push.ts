import { log } from '../utils/logger';
import { exec, execLive, gitSha } from '../utils/exec';
import { SERVICES, DOCKER_USER, servicePath, isValidService, ServiceName } from '../utils/config';

export async function buildPush(args: string[]) {
  const target = args[0] || 'all';
  const shouldPush = args.includes('--push');
  const sha = gitSha();

  let services: ServiceName[];

  if (target === 'all') {
    services = [...SERVICES];
  } else if (isValidService(target)) {
    services = [target];
  } else {
    log.error(`Unknown service "${target}". Available: ${SERVICES.join(', ')}`);
    return;
  }

  log.header(`Build${shouldPush ? ' & Push' : ''}: ${services.join(', ')}`);

  for (const svc of services) {
    const image = `${DOCKER_USER}/${svc}`;
    const svcDir = servicePath(svc);

    log.step(`Building ${image}:${sha}`);

    const ok = execLive(`docker build -t ${image}:${sha} -t ${image}:latest ${svcDir}`);
    if (!ok) {
      log.error(`Failed to build ${svc}`);
      continue;
    }
    log.success(`Built ${image}:${sha}`);

    if (shouldPush) {
      log.step(`Pushing ${image}`);
      const pushOk = execLive(`docker push ${image}:${sha}`) && execLive(`docker push ${image}:latest`);
      if (pushOk) {
        log.success(`Pushed ${image}:${sha} + latest`);
      } else {
        log.error(`Failed to push ${svc}`);
      }
    }
  }

  log.success('Done');
}
