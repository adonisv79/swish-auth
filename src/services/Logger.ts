import winston from 'winston';
// Imports the Google Cloud client library for Winston
import { LoggingWinston } from '@google-cloud/logging-winston';
import config from '../config';

const d = new Date();
const logFilePrefix = d.getUTCFullYear() + (`0${d.getUTCMonth() + 1}`).slice(-2) + (`0${d.getUTCDate()}`).slice(-2);

function createLogger(): winston.Logger {
  if (config.server.deploymentType === 'production') {
    const loggingWinston = new LoggingWinston();
    return winston.createLogger({
      level: config.server.logLevel,
      transports: [
        new winston.transports.Console(),
        // Add Stackdriver Logging
        loggingWinston,
      ],
    });
  }
  return winston.createLogger({
    level: config.server.logLevel,
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: `logs/${logFilePrefix}-error.log`, level: 'error' }),
      new winston.transports.File({ filename: `logs/${logFilePrefix}-combined.log` }),
      new winston.transports.Console({ format: winston.format.simple() }),
    ],
  });
}

const singleton: winston.Logger = createLogger();

export default singleton;
