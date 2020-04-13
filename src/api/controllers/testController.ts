import { Request, Response, NextFunction } from 'express';

export async function testSuccess(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await res.sendSwish(req, res, next, { message: `Hello ${req.query.person}` });
  } catch (err) {
    next(err);
  }
}

export async function testError(req: Request, res: Response, next: NextFunction): Promise<void> {
  next(new Error('This is a test error'));
}
