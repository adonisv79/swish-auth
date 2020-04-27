import mongoose, { Schema } from 'mongoose';
import config from '../config';
import logger from '../services/Logger';
// import emailsModel from './EmailsModel';
import usersModel from './UsersModel';

const connectionMaxRetry = 3;
let connectionRetries = 0;

async function connect(): Promise<void> {
  try {
    connectionRetries += 1;
    if (connectionRetries > connectionMaxRetry) {
      logger.error('MONGODB_CONN_ERR: Max retries reached... shutting service');
      process.exit(1);
    }
    logger.info('MONGODB_CONNECTING', { attempt: connectionRetries });
    await mongoose.connect(config.mongodb.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connectionRetries = 0; // reset once connected
  } catch (err) {
    logger.error(err.message);
  }
}

const conn = mongoose.connection;
mongoose.set('useCreateIndex', true); // MongoDB collection.ensureIndex is deprecated in 4.x
conn.on('error', (err) => {
  logger.error('MONGODB_ERR', { message: err.message });
  conn.close();
  connect();
});
conn.once('open', () => {
  logger.info('MongoDB connection established!');
});

connect();

export default {
  // emails: emailsModel,
  users: usersModel,
};
