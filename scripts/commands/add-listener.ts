import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger';
import { servicePath, NATS_SERVICES } from '../utils/config';
import { writeTemplate } from '../utils/template';

function toKebab(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/Event$/, '')
    .toLowerCase();
}

function toClassName(eventName: string): string {
  return eventName.replace(/Event$/, '') + 'Listener';
}

function toSubject(eventName: string): string {
  // OrderCreatedEvent -> OrderCreated
  return eventName.replace(/Event$/, '');
}

export async function addListener(args: string[]) {
  const service = args[0];
  const eventName = args[1];

  if (!service || !eventName) {
    log.error('Usage: add-listener <service> <EventName>');
    log.info('Example: add-listener tickets ExpirationCompleteEvent');
    return;
  }

  if (!(NATS_SERVICES as readonly string[]).includes(service)) {
    log.error(`"${service}" is not a NATS service. Available: ${NATS_SERVICES.join(', ')}`);
    return;
  }

  const className = toClassName(eventName);
  const fileName = toKebab(eventName) + '-listener';
  const subject = toSubject(eventName);

  const listenersDir = path.join(servicePath(service), 'src/events/listeners');
  const testDir = path.join(listenersDir, '__test__');
  const listenerPath = path.join(listenersDir, `${fileName}.ts`);
  const testPath = path.join(testDir, `${fileName}.test.ts`);

  if (fs.existsSync(listenerPath)) {
    log.error(`Listener already exists: ${listenerPath}`);
    return;
  }

  log.header(`Adding listener: ${className} to ${service}`);

  // Ensure directories exist
  fs.mkdirSync(testDir, { recursive: true });

  // Generate files
  const vars = { eventName, className, subject, fileName };

  writeTemplate('listener.ts.tpl', listenerPath, vars);
  log.step(`Created ${listenerPath}`);

  writeTemplate('listener.test.ts.tpl', testPath, vars);
  log.step(`Created ${testPath}`);

  // Show what to add to index.ts
  log.success(`Listener "${className}" created`);
  log.info('Add to src/index.ts:');
  log.dim(`  import { ${className} } from "./events/listeners/${fileName}";`);
  log.dim(`  new ${className}(natsWrapper.client).listen();`);
}
