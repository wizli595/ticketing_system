import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger';
import { servicePath, isBackendService } from '../utils/config';
import { writeTemplate } from '../utils/template';

const VERBS = ['get', 'post', 'put', 'delete', 'patch'] as const;

function toPascal(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toRouterName(verb: string, resource: string): string {
  return `${verb}${toPascal(resource)}Router`;
}

export async function addRoute(args: string[]) {
  const service = args[0];
  const resource = args[1];
  const verb = (args[2] || 'get').toLowerCase();

  if (!service || !resource) {
    log.error('Usage: add-route <service> <resource> [verb]');
    log.info('Example: add-route tickets categories post');
    return;
  }

  if (!isBackendService(service)) {
    log.error(`Unknown backend service "${service}"`);
    return;
  }

  if (!VERBS.includes(verb as any)) {
    log.error(`Invalid verb "${verb}". Use: ${VERBS.join(', ')}`);
    return;
  }

  const routerName = toRouterName(verb, resource);
  const fileName = resource;
  const routesDir = path.join(servicePath(service), 'src/routes');
  const testDir = path.join(routesDir, '___test___');
  const routePath = path.join(routesDir, `${fileName}.ts`);
  const testPath = path.join(testDir, `${fileName}.test.ts`);

  if (fs.existsSync(routePath)) {
    log.error(`Route file already exists: ${routePath}`);
    return;
  }

  log.header(`Adding route: ${verb.toUpperCase()} /api/${service}/${resource}`);

  fs.mkdirSync(testDir, { recursive: true });

  const statusCode = verb === 'post' ? 201 : 200;
  const vars = { service, resource, verb, routerName, statusCode };

  writeTemplate('route.ts.tpl', routePath, vars);
  log.step(`Created ${routePath}`);

  writeTemplate('route.test.ts.tpl', testPath, vars);
  log.step(`Created ${testPath}`);

  log.success(`Route created`);
  log.info('Add to src/app.ts:');
  log.dim(`  import { ${routerName} } from "./routes/${fileName}";`);
  log.dim(`  app.use("/api", ${routerName});`);
}
