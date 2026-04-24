import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger';
import { ROOT, DOCKER_USER, servicePath, k8sPath } from '../utils/config';
import { writeTemplate } from '../utils/template';

interface ServiceOptions {
  name: string;
  mongo: boolean;
  nats: boolean;
  stripe?: boolean;
}

function parseArgs(args: string[]): ServiceOptions | null {
  const name = args[0];
  if (!name) {
    log.error('Usage: new-service <name> [--mongo] [--nats] [--stripe]');
    log.info('Example: new-service notifications --nats --mongo');
    return null;
  }

  if (fs.existsSync(servicePath(name))) {
    log.error(`Service "${name}" already exists at ${servicePath(name)}`);
    return null;
  }

  const flags = args.slice(1);
  const hasFlag = (f: string) => flags.includes(f);

  // Default to both mongo and nats if no flags given
  const noFlags = !hasFlag('--mongo') && !hasFlag('--nats') && !hasFlag('--stripe');

  return {
    name,
    mongo: noFlags || hasFlag('--mongo'),
    nats: noFlags || hasFlag('--nats'),
    stripe: hasFlag('--stripe'),
  };
}

export async function newService(args: string[]) {
  const opts = parseArgs(args);
  if (!opts) return;

  const { name, mongo, nats, stripe } = opts;
  const svcPath = servicePath(name);

  log.header(`Creating service: ${name}`);
  log.info(`MongoDB: ${mongo ? 'yes' : 'no'} | NATS: ${nats ? 'yes' : 'no'} | Stripe: ${stripe ? 'yes' : 'no'}`);

  // Create directory structure
  const dirs = ['src/routes/___test___', 'src/models', 'src/test'];
  if (nats) {
    dirs.push('src/events/listeners/__test__', 'src/events/publishers', 'src/__mocks__');
  }
  for (const dir of dirs) {
    fs.mkdirSync(path.join(svcPath, dir), { recursive: true });
  }
  log.step('Created directory structure');

  // Template variables
  const vars = { name, mongo, nats, stripe, dockerUser: DOCKER_USER, port: 3000 };

  // Generate source files
  writeTemplate('app.ts.tpl', path.join(svcPath, 'src/app.ts'), vars);
  writeTemplate('index.ts.tpl', path.join(svcPath, 'src/index.ts'), vars);
  log.step('Generated src/app.ts, src/index.ts');

  if (nats) {
    writeTemplate('nats-wrapper.ts.tpl', path.join(svcPath, 'src/nats-wrapper.ts'), vars);
    writeTemplate('nats-wrapper.mock.ts.tpl', path.join(svcPath, 'src/__mocks__/nats-wrapper.ts'), vars);
    // Queue group name
    fs.writeFileSync(
      path.join(svcPath, 'src/events/listeners/queue-group-name.ts'),
      `export const queueGroupName = "${name}-service";\n`
    );
    log.step('Generated NATS wrapper + mock + queue group');
  }

  if (mongo) {
    writeTemplate('test-setup.ts.tpl', path.join(svcPath, 'src/test/setup.ts'), vars);
    log.step('Generated test setup');
  }

  // Dockerfile
  writeTemplate('Dockerfile.tpl', path.join(svcPath, 'Dockerfile'), vars);
  log.step('Generated Dockerfile');

  // tsconfig.json
  fs.writeFileSync(
    path.join(svcPath, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'es2018',
          module: 'commonjs',
          lib: ['es2018'],
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          outDir: './dist',
          rootDir: './src',
        },
        include: ['src/**/*'],
      },
      null,
      2
    ) + '\n'
  );
  log.step('Generated tsconfig.json');

  // package.json
  const deps: Record<string, string> = {
    '@wizlitickets/common': '^1.0.25',
    'cookie-session': '^2.0.0',
    express: '^4.18.2',
    'express-async-errors': '^3.1.1',
    jsonwebtoken: '^9.0.0',
    'ts-node-dev': '^2.0.0',
    typescript: '^5.0.0',
  };

  if (mongo) {
    deps['mongoose'] = '^7.0.0';
    deps['mongoose-update-if-current'] = '^1.4.0';
  }
  if (nats) {
    deps['node-nats-streaming'] = '^0.3.2';
  }
  if (stripe) {
    deps['stripe'] = '^12.0.0';
  }

  const devDeps: Record<string, string> = {
    '@types/cookie-session': '^2.0.44',
    '@types/express': '^4.17.17',
    '@types/jsonwebtoken': '^9.0.2',
    jest: '^29.5.0',
    'ts-jest': '^29.1.0',
    '@types/jest': '^29.5.0',
    supertest: '^6.3.0',
    '@types/supertest': '^2.0.12',
  };

  if (mongo) {
    devDeps['mongodb-memory-server'] = '^8.12.0';
  }

  const pkg = {
    name,
    version: '1.0.0',
    scripts: {
      start: 'ts-node-dev src/index.ts',
      test: 'jest --watchAll --no-cache --detectOpenHandles',
    },
    jest: {
      preset: 'ts-jest',
      testEnvironment: 'node',
      setupFilesAfterSetup: ['./src/test/setup.ts'],
    },
    dependencies: deps,
    devDependencies: devDeps,
  };

  fs.writeFileSync(path.join(svcPath, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  log.step('Generated package.json');

  // K8s manifests
  writeTemplate('depl.yaml.tpl', path.join(k8sPath(), `${name}-depl.yaml`), vars);
  log.step(`Generated infra/k8s/${name}-depl.yaml`);

  if (mongo) {
    writeTemplate('mongo-depl.yaml.tpl', path.join(k8sPath(), `${name}-mongo-depl.yaml`), vars);
    log.step(`Generated infra/k8s/${name}-mongo-depl.yaml`);
  }

  log.success(`Service "${name}" created at ${svcPath}`);
  log.info('Next steps:');
  log.info(`  cd ${name} && npm install`);
  log.info('  Add routes to src/app.ts');
  log.info('  Add models to src/models/');
  if (nats) log.info('  Add event listeners and register them in src/index.ts');
  log.info('  Add the service to skaffold.yaml');
}
