import fs from 'fs';
import { log } from '../utils/logger';
import { DOCKER_USER, k8sPath } from '../utils/config';
import { writeTemplate } from '../utils/template';
import path from 'path';

export async function genK8s(args: string[]) {
  const name = args[0];

  if (!name) {
    log.error('Usage: gen-k8s <service> [--mongo] [--nats] [--stripe] [--port 3000]');
    log.info('Example: gen-k8s notifications --nats --mongo');
    return;
  }

  const hasFlag = (f: string) => args.includes(f);
  const getFlagValue = (f: string) => {
    const idx = args.indexOf(f);
    return idx >= 0 && args[idx + 1] ? args[idx + 1] : null;
  };

  const noFlags = !hasFlag('--mongo') && !hasFlag('--nats') && !hasFlag('--stripe');
  const mongo = noFlags || hasFlag('--mongo');
  const nats = noFlags || hasFlag('--nats');
  const stripe = hasFlag('--stripe');
  const port = getFlagValue('--port') || '3000';

  const vars = { name, mongo, nats, stripe, port, dockerUser: DOCKER_USER };

  log.header(`Generating K8s manifests for: ${name}`);

  const deplPath = path.join(k8sPath(), `${name}-depl.yaml`);
  writeTemplate('depl.yaml.tpl', deplPath, vars);
  log.step(`Generated ${deplPath}`);

  if (mongo) {
    const mongoPath = path.join(k8sPath(), `${name}-mongo-depl.yaml`);
    writeTemplate('mongo-depl.yaml.tpl', mongoPath, vars);
    log.step(`Generated ${mongoPath}`);
  }

  log.success('K8s manifests generated');
  log.info(`Apply with: kubectl apply -f infra/k8s/${name}-depl.yaml`);
}
