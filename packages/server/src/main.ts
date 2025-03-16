#!/usr/bin/env node

import net from 'net';
import { spawnSync } from 'child_process';
import yargs, { Arguments } from 'yargs';
import { hideBin } from 'yargs/helpers';

type TurboTaskLike = {
  taskId: string;
  cache: {
    status: 'HIT' | 'MISS' | string;
  };
};

type TurboResult = {
  tasks: TurboTaskLike[];
};

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
  .help()
  .alias('help', 'h').argv as Arguments<{
  port: number;
  task_id: string;
}>;

const { port, task_id } = argv;

// Check if the build is cached
const result = spawnSync('yarn', ['turbo', 'run', 'build', '--dry-run=json'], {
  encoding: 'utf-8',
});

const isCached =
  (JSON.parse(result.stdout || '{}') as TurboResult).tasks.find(
    ({ taskId }) => taskId === task_id
  )?.cache?.status === 'HIT';

if (isCached) {
  console.log('⚡ Build was cached. Skipping Stoplight.');
  process.exit(0);
}

console.log('🚀 Build not cached. Turning on Stoplight...');

const server = net.createServer((socket) => {
  socket.on('data', () => {
    console.log('✅ Build finished. Turning off Stoplight...');
    server.close(() => process.exit(0));
  });
});

server.listen(port, () => {
  console.log(`🚀 Stoplight listening on port ${port}`);
});

// Handle manual stop (CTRL+C)
process.on('SIGINT', () => {
  console.log('🛑 Stoplight stopped manually.');
  server.close(() => process.exit(0));
});
