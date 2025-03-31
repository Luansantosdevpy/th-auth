/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response, NextFunction } from 'express';

import { ApiError } from '../../infrastructure/error/apiError';
import Logger from '../../infrastructure/log/logger';


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line unused-imports/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else {
    Logger.error('Unhandled Error:', err);
  }

  res.status(statusCode).json({
    status: statusCode,
    message,
    details,
  });
};