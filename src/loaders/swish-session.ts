import {
  Swish, swishSessionObject, onSessionCreateCallback,
  onSessionDestroyCallback, onSessionRetrieveCallback, onSessionUpdateCallback,
} from 'express-swish-protocol';
import {
  RedisSessionManager, RedisSessionOptions, onRedisSessionErrorCallback, RedisSessionObject,
} from 'redis-toolbox';
import { Logger } from 'winston';
import config from '../config';

let singleton: Swish;
let redisSess: RedisSessionManager;
let logger: Logger;

function initRedis(): void {
  const redisOptions: RedisSessionOptions = {
    host: config.redis.host,
    port: config.redis.port,
    db: config.redis.dbs.sessions,
    password: config.redis.password,
    sessionMaxTTL: config.session.maxTTL,
    sessionRefreshTTL: true,
    sessionInactiveTTL: config.session.idleTTL,
  };

  const onSessionError: onRedisSessionErrorCallback = async (err: Error): Promise<boolean> => {
    // do whatever async tasks like send metrics, alerts, etc.
    logger.error(`Error on session: ${err.message}`);
    return false;
  };

  logger.info(`Connecting to REDIS at ${redisOptions.host}:${redisOptions.port}`);
  logger.info(`User Session TTL Set at ${redisOptions.sessionMaxTTL}`);
  if (redisOptions.sessionInactiveTTL) {
    logger.info(`User Session Idle TTL Set at ${redisOptions.sessionInactiveTTL}`);
  }

  redisSess = new RedisSessionManager(redisOptions, onSessionError);
}

function initSwish(): void {
  const onSessionCreate: onSessionCreateCallback = async (): Promise<swishSessionObject> => {
    // Note: validate if handshake was done first before creating a new entry


    const result = await redisSess.createSession();
    if (result.sessionId !== '') {
      const swish: swishSessionObject = {
        sessionId: result.sessionId,
        createdDate: result.sessionDate,
      };
      logger.info(`Session created (time: ${swish.createdDate.toString()}): ${swish.sessionId}`);
      return swish;
    }
    throw new Error('SESSION_CREATION_FAILS');
  };

  const onSessionRetrieve: onSessionRetrieveCallback = async (sessionId: string): Promise<swishSessionObject> => {
    const result: RedisSessionObject = await redisSess.retrieveSession(sessionId);
    const swish: swishSessionObject = {
      sessionId: result.sessionId,
      createdDate: result.createdDate,
      nextPrivate: result.nextPrivate,
      nextPublic: result.nextPublic,
    };
    return swish;
  };

  const onSessionUpdate: onSessionUpdateCallback = async (sessionId: string, delta: swishSessionObject): Promise<boolean> => {
    const result = await redisSess.updateSession(sessionId, delta as any);
    if (!result) {
      throw new Error('SESSION_UPDATE_FAILS');
    }
    return true;
  };

  const onSessionDestroy: onSessionDestroyCallback = async (sessionID: string): Promise<boolean> => {
    const result = await redisSess.destroySession(sessionID);
    if (!result) {
      throw new Error('SESSION_DELETION_FAILS');
    }
    return true;
  };

  singleton = new Swish(
    onSessionCreate, onSessionRetrieve, onSessionUpdate, onSessionDestroy,
  );
}

export default function MiddleWare(l: Logger): any {
  logger = l;
  if (!singleton) {
    initRedis();
    initSwish();
  }
  return singleton.middleware;
}
