import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis, IRateLimiterStoreOptions } from 'rate-limiter-flexible';
import redis from 'redis';
import config from '../../config';
import logger from '../../services/Logger';

logger.info('Setting rate limiter...', config.ingress.rateLimit);
const rc: redis.RedisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  db: config.redis.dbs.rateLimit,
  password: config.redis.password,
  /* eslint-disable @typescript-eslint/camelcase */
  enable_offline_queue: false,
});

const options: IRateLimiterStoreOptions = {
  storeClient: rc,
  keyPrefix: 'middleware',
  points: config.ingress.rateLimit.points,
  duration: config.ingress.rateLimit.duration,
  blockDuration: config.ingress.rateLimit.blockDuration,
  inmemoryBlockOnConsumed: config.ingress.rateLimit.points,
  inmemoryBlockDuration: config.ingress.rateLimit.blockDuration,
};
const rateLimiter: RateLimiterRedis = new RateLimiterRedis(options);

export default async function middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.ip) {
      await rateLimiter.consume(req.ip, config.ingress.rateLimit.consumption);
    } else {
      res.status(400).send('REQUEST_INVALID');
    }
    next();
  } catch (err) {
    logger.warn('REQUEST_TOO_MANY', { ip: req.ip });
    res.status(429).send('REQUEST_TOO_MANY');
  }
}
