import dotenv from 'dotenv';

dotenv.config();

export default {
  redis: {
    port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST as string : 'localhost',
    db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB as string, 10) : 0,
    password: process.env.REDIS_PASS ? process.env.REDIS_PASS as string : undefined,
  },
  session: {
    maxTTL: process.env.USER_SESSION_MAX_TTL ? parseInt(process.env.USER_SESSION_MAX_TTL as string, 10) : 21600,
    idleTTL: process.env.USER_SESSION_IDLE_TTL ? parseInt(process.env.USER_SESSION_IDLE_TTL as string, 10) : 1800,
  },
  server: {
    deploymentType: process.env.NODE_ENV || 'development',
    logLevel: process.env.SERVER_LOG_LEVEL ? process.env.SERVER_LOG_LEVEL as string : 'info',
  },
};
