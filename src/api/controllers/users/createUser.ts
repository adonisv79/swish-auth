import { Request, Response, NextFunction } from 'express';
import HttpError, { clientErrorCodes } from 'http-error-types';
import models from '../../../models';
import { validateParameters } from '../../../models/Schemas';

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reqData = { ...req.body };
    const result = validateParameters(reqData, 'usersRegistration');
    if (result.error) {
      return next(new HttpError(clientErrorCodes.badRequest, result.error.message));
    }
    const exists = await models.users.existsUsername(reqData.username);
    if (exists) {
      throw new HttpError(clientErrorCodes.badRequest, 'username already in use');
    }

    const results = await models.users.registerUser(reqData.username, reqData.password);
    await res.sendSwish(req, res, next, results);
  } catch (err) {
    next(err);
  }
}
