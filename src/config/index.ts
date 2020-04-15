import dotenv from 'dotenv';

dotenv.config();
const singleton = {
  redis: {
    port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST as string : 'localhost',
    dbs: {
      sessions: process.env.REDIS_DB_SESSION ? parseInt(process.env.REDIS_DB_SESSION as string, 10) : 0,
      rateLimit: process.env.REDIS_DB_RATELIMIT ? parseInt(process.env.REDIS_DB_RATELIMIT as string, 10) : 1,
    },
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
  ingress: {
    rateLimit: {
      points: process.env.INGRESS_RATELIMIT_POINTS ? parseInt(process.env.INGRESS_RATELIMIT_POINTS as string, 10) : 10,
      duration: process.env.INGRESS_RATELIMIT_DURATION ? parseInt(process.env.INGRESS_RATELIMIT_DURATION as string, 10) : 1,
      consumption: process.env.INGRESS_RATELIMIT_CONSUMPTION ? parseInt(process.env.INGRESS_RATELIMIT_CONSUMPTION as string, 10) : 1,
      blockDuration: process.env.INGRESS_RATELIMIT_BLOCKDURATION ? parseInt(process.env.INGRESS_RATELIMIT_BLOCKDURATION as string, 10) : 5,
    },
  },
};

export default singleton;
