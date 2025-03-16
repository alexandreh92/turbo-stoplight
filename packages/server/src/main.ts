#!/usr/bin/env node

import net from 'net';
import { spawnSync } from 'child_process';
import yargs, { Arguments } from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';
import { cyan, green, red } from 'kolorist';

const logPrefix = '[turbo-stoplight-server]:';

type TurboTaskLike = {
  taskId: string;
  cache: {
    status: 'HIT' | 'MISS' | string;
  };
};

type TurboResult = {
  tasks: TurboTaskLike[];
};

function detectPackageManager(): string {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  } else if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  } else if (fs.existsSync(path.join(cwd, 'package-lock.json'))) {
    return 'npm';
  }
  return 'pnpm';
}

const argv = yargs(hideBin(process.argv))
  .option('port', {
    type: 'number',
    default: 4000,
    describe: 'Port for the Stoplight server',
  })
  .option('task_id', {
    type: 'string',
    demandOption: true,
    describe: 'Task ID to check if the build is cached',
  })
  .option('turbo_command', {
    type: 'string',
    default: 'build',
    describe: 'Turbo command to run',
  })
  .option('turbo_args', {
    type: 'array',
    default: [],
    describe: 'Additional arguments to pass to Turbo',
  })
  .option('package_manager', {
    type: 'string',
    default: detectPackageManager(),
    describe: 'Package manager to use (npm, yarn, pnpm)',
  })
  .help()
  .alias('help', 'h').argv as Arguments<{
  port: number;
  task_id: string;
  turbo_command: string;
  turbo_args: string[];
  package_manager: string;
}>;

const { port, task_id, turbo_command, turbo_args, package_manager } = argv;

const turboBaseArgs = [
  'turbo',
  'run',
  turbo_command,
  '--dry-run=json',
  ...turbo_args,
];
const result = spawnSync(package_manager, turboBaseArgs, {
  encoding: 'utf-8',
});

const isCached =
  (JSON.parse(result.stdout || '{}') as TurboResult).tasks.find(
    ({ taskId }) => taskId === task_id
  )?.cache?.status === 'HIT';

if (isCached) {
  console.log(green(`${logPrefix} ⚡ Build was cached. Skipping Stoplight.`));
  process.exit(0);
}

console.log(cyan(`${logPrefix} 🚀 Build not cached. Turning on Stoplight...`));

const server = net.createServer((socket) => {
  socket.on('data', () => {
    console.log(
      green(`${logPrefix} ✅ Build finished. Turning off Stoplight...`)
    );
    server.close(() => process.exit(0));
  });
});

server.listen(port, () => {
  console.log(cyan(`${logPrefix} 🚀 Stoplight listening on port ${port}`));
});

process.on('SIGINT', () => {
  console.log(red(`\n${logPrefix} 🛑 Stoplight stopped manually.`));
  server.close(() => process.exit(0));
});
