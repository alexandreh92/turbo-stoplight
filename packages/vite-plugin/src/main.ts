import { Socket } from 'net';
import type { Plugin, Logger } from 'vite';

const pluginName = 'vite-build-watch-notifier';
const logPrefix = `[${pluginName}]`;

export type TurboStoplightOptions = {
  port: number;
};

export function turboStoplight({ port }: TurboStoplightOptions): Plugin {
  let isWatchMode = false;
  let logger: Logger;
  let notified = false;

  function sendNotification(
    { suppressError = false }: { suppressError?: boolean } = {},
    callback?: () => void
  ) {
    const client = new Socket();

    client.connect(port, 'localhost', () => {
      logger.info(`\n${logPrefix} 📩 Sending build completion notification...`);
      client.write('Build complete');
      notified = true;
      client.end();
      callback?.();
    });

    client.on('error', () => {
      if (suppressError) return;
      logger.error(
        `\n${logPrefix} ❌ Failed to connect to notification server: Maybe the server is not running?`
      );
      client.destroy();
      callback?.();
    });

    client.on('connect', () => {
      logger.info(`\n${logPrefix} ✅ Notification sent successfully.`);
    });
  }

  return {
    name: 'turbo-stoplight',
    apply: 'build',
    configResolved(config) {
      isWatchMode = !!config.build.watch;
      logger = config.logger;
    },
    buildEnd() {
      if (!isWatchMode || notified) return;

      logger.info(`\n${logPrefix} ✅ Build finished. Notifying Stoplight...`);
      sendNotification();
    },
  };
}
