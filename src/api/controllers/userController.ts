import type { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

import UserService from '../../application/services/userService';
import type { UserAttributes } from '../../domain/models/userAttributes';
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
}
