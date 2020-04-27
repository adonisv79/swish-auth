import { Request, Response, NextFunction } from 'express';

function validatePayload() {
}

export async function retrieveUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await res.sendSwish(req, res, next, { message: `Retrieved user ${req.params.userId}...` });
  } catch (err) {
    next(err);
  }
}
