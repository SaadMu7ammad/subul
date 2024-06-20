import { startWebServer } from '@src/server';
import logger from '@utils/logger';

const start = async () => {
  return startWebServer();
};

start().then(() => {
  logger.info(`The app has started successfully`);
});
