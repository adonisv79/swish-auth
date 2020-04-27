import { EventEmitter } from 'events';
import HttpError from 'http-error-types';
import e, {
  Express, Request, Response, NextFunction,
} from 'express';
import logger from '../services/Logger';
import usersRoutes from './routes/users';
import testRoutes from './routes/testRoutes';

export default class API extends EventEmitter {
  private app: Express;

  private port: number;

  constructor(port: number) {
    super();
    this.app = e();
    this.port = port;
  }

  private loadRoutes(): void {
    this.app.use('/sapi/users', usersRoutes);
    this.app.use('/sapi/test', testRoutes);
  }

  private addErrorHandlerMiddleware(): void {
    this.app.use((err: HttpError, req: Request, res: Response, next: NextFunction): any => {
      if (!err.isHttpError) { // generic error
        logger.error('UNHANDLED_ERROR', { name: err.name, message: err.message, stack: err.stack });
        return res.status(500).send({ error: 'Applogies but an error occured from our end. Please report this so we can serve you better.' });
      }
      logger.error(err.message, {
        name: err.name, message: err.message, stack: err.stack, statusCode: err.statusCode,
      });
      return res.status(err.statusCode).send(err.message);
    });
  }

  start(): void {
    this.emit('loading', this.app);
    this.loadRoutes();
    this.addErrorHandlerMiddleware();
    this.app.listen(this.port, () => {
      logger.info(`Example app listening on port ${this.port}!`);
    });
  }
}
