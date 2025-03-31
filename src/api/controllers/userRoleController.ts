import type { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

import UserRoleService from '../../application/services/userRoleService';
import type { UserRole } from '../../domain/models/userRole';
import Logger from '../../infrastructure/log/logger';
import { successResponse } from '../../infrastructure/utils/responseFormatter';
import { BaseController } from '../controllers/baseController';

@injectable()
export default class UserRoleController extends BaseController {
  public assignRoleToUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('UserRoleController - assignRoleToUser - Request Received');

      const { userId, roleId } = req.body as UserRole;

      const userRoleService = this.resolve(UserRoleService);
      const faceGroup = await userRoleService.assignRoleToUser({ userId, roleId });

      Logger.debug('UserRoleController - assignRoleToUser - User role created successfully');
      return res.status(201).json(successResponse(201, 'User role created successfully', faceGroup));
    }, req, res, next);
  };

  public findRolesByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('UserRoleController - findRolesByUser - Request Received');
      const { userId } = req.body

      const userRoleService = this.resolve(UserRoleService);
      const roleList = await userRoleService.findRolesByUser(userId);

      Logger.debug('UserRoleController - findRolesByUser - Retrieved successfully');
      return res.status(200).json(successResponse(200, 'Role retrieved successfully', roleList));
    }, req, res, next);
  };
}
