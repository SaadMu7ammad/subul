import logger from '@utils/logger';
import { startWebServer } from '@utils/server';

const start = async () => {
  return startWebServer();
};

start().then(() => {
  logger.info(`The app has started successfully`);
});
