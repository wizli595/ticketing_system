const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

export const log = {
  info: (msg: string) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}[OK]${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  error: (msg: string) => console.error(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg: string) => console.log(`${colors.cyan}>>>${colors.reset} ${msg}`),
  dim: (msg: string) => console.log(`${colors.gray}${msg}${colors.reset}`),
  header: (msg: string) => {
    const line = '─'.repeat(50);
    console.log(`\n${colors.bold}${colors.magenta}${line}${colors.reset}`);
    console.log(`${colors.bold}  ${msg}${colors.reset}`);
    console.log(`${colors.magenta}${line}${colors.reset}\n`);
  },
};
