import type { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

import UserService from '../../application/services/userService';
import type { UserAttributes } from '../../domain/models/userAttributes';
import { ApiError } from '../../infrastructure/error/apiError';
import Logger from '../../infrastructure/log/logger';
import { successResponse } from '../../infrastructure/utils/responseFormatter';
import { BaseController } from '../controllers/baseController';

@injectable()
export default class UserController extends BaseController {
  public assignAttributesToUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('UserController - assignAttributesToUser - Request Received');

      const { userId, name, phone, photo, address, sex, birthday } = req.body as UserAttributes;

      const userService = this.resolve(UserService);
      const faceGroup = await userService.assignAttributesToUser({ userId, name, phone, photo, address, sex, birthday });

      Logger.debug('UserController - assignAttributesToUser - Attributes added to user');
      return res.status(200).json(successResponse(200, 'Attributes added to user', faceGroup));
    }, req, res, next);
  };

  public verifyPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('UserController - verifyPermission - Request Received');

      const token = req.headers.authorization?.split(' ')[1];
      const { requiredPermission } = req.body;

      if (!token) {
        Logger.error('UserController - verifyPermission - Token not provided');
        throw ApiError.badRequest('Token not provided');
      }
      if (!requiredPermission) {
        Logger.error('UserController - verifyPermission - Required permission not provided');
        throw ApiError.badRequest('Required permission not provided');
      }

      const userService = this.resolve(UserService);
      const hasPermission = await userService.verifyUserPermission(token, requiredPermission);

      if (!hasPermission) {
        Logger.debug('UserController - verifyPermission - Access denied');
        return res.status(403).json(successResponse(403, 'Access denied'));
      }

      Logger.debug('UserController - verifyPermission - Access granted');
      return res.status(200).json(successResponse(200, 'Access granted'));
    }, req, res, next);
  };
}
