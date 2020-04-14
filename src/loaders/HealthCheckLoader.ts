import {
  Express, Request, Response, NextFunction,
} from 'express';
import logger from '../services/Logger';

async function checkRedisConnection(): Promise<boolean> {
  return true;
}

async function checkMobgoDBConnection(): Promise<boolean> {
  return true;
}

export default async function loadHealthCheck(app: Express): Promise<void> {
  logger.info('Healthcheck route [/health] set...');
  app.get('/health', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await checkRedisConnection();
      await checkMobgoDBConnection();
      await res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  });
}
