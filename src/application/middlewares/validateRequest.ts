import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { ApiError } from '../../infrastructure/error/apiError';

export const validationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array();
    next(ApiError.unprocessabelEntity('Validation failed', details));
  } else {
    next();
  }
};
