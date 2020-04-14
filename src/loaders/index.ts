import path from 'path';
import bodyParser from 'body-parser';
import e from 'express';
import config from '../config';
import logger from '../services/Logger';
import loadHealthCheck from './HealthCheckLoader';
import swishMiddleWare from './swish-session';

async function initialize(app: e.Express): Promise<void> {
  logger.info(`Initializing server for the "${config.server.deploymentType}" environment...`);
  const publicPath = path.join(__dirname, './../public');
  app.use(bodyParser.json());
  logger.info(`Serving public files from "${publicPath}"...`);
  app.use(e.static(publicPath));
  loadHealthCheck(app);
  logger.info('Loading swish middleware...');
  // everything under 'sapi' will be secured by the swish protocol
  app.use('/sapi/*', swishMiddleWare(logger));
}

export default { init: initialize };
