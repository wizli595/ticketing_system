import { log } from './utils/logger';
import { newService } from './commands/new-service';
import { buildPush } from './commands/build-push';
import { testAll } from './commands/test-all';
import { addListener } from './commands/add-listener';
import { addRoute } from './commands/add-route';
import { genK8s } from './commands/gen-k8s';
import { healthCheck } from './commands/health-check';

const COMMANDS: Record<string, { handler: (args: string[]) => Promise<void>; desc: string }> = {
  'new-service': { handler: newService, desc: 'Scaffold a new microservice' },
  build:         { handler: buildPush, desc: 'Build (and push) Docker images' },
  test:          { handler: testAll, desc: 'Run tests across services' },
  'add-listener': { handler: addListener, desc: 'Scaffold a NATS event listener' },
  'add-route':   { handler: addRoute, desc: 'Scaffold an Express route' },
  'gen-k8s':     { handler: genK8s, desc: 'Generate K8s deployment manifests' },
  health:        { handler: healthCheck, desc: 'Check cluster pod health' },
};

function showHelp() {
  log.header('GitTix CLI');
  console.log('Usage: npx tsx scripts/cli.ts <command> [args]\n');
  console.log('Commands:');
  for (const [name, { desc }] of Object.entries(COMMANDS)) {
    console.log(`  ${name.padEnd(16)} ${desc}`);
  }
  console.log('\nExamples:');
  console.log('  npx tsx scripts/cli.ts new-service notifications --nats --mongo');
  console.log('  npx tsx scripts/cli.ts build tickets --push');
  console.log('  npx tsx scripts/cli.ts test all --ci');
  console.log('  npx tsx scripts/cli.ts add-listener orders PaymentCreatedEvent');
  console.log('  npx tsx scripts/cli.ts add-route tickets categories post');
  console.log('  npx tsx scripts/cli.ts gen-k8s notifications --nats --mongo');
  console.log('  npx tsx scripts/cli.ts health');
  console.log('');
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  const cmd = COMMANDS[command];
  if (!cmd) {
    log.error(`Unknown command: "${command}"`);
    showHelp();
    process.exit(1);
  }

  try {
    await cmd.handler(args);
  } catch (err: any) {
    log.error(err.message);
    process.exit(1);
  }
}

main();
