import { EventEmitter } from 'events';
import e, { Express } from 'express';
import logger from '../services/Logger';
import testRoutes from './routes/testRoutes';

export default class API extends EventEmitter {
  private app: Express;

  private port: number;

  constructor(port: number) {
    super();
    this.app = e();
    this.port = port;
  }

  start(): void {
    this.emit('loading', this.app);
    this.app.use('/sapi/test', testRoutes);
    this.app.listen(this.port, () => {
      logger.info(`Example app listening on port ${this.port}!`);
    });
  }
}
