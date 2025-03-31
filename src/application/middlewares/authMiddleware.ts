import type { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import { ApiError } from '../../infrastructure/error/apiError';
import AuthService from '../services/authService';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token not provided');
    }

    const token = authHeader.split(' ')[1];
    const authService = container.resolve(AuthService);
    const payload = authService.verifyToken(token);

    req.user = { 
      id: payload.id, 
      email: payload.email,
      organizationId: payload.organizationId
    };

    next();
  } catch (err) {
    next(err);
  }
};