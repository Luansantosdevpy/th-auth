import type { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { container } from 'tsyringe';

import { ApiError } from '../../infrastructure/error/apiError';
import Logger from '../../infrastructure/log/logger';
import AuthService from '../services/authService';
import PermissionRoleService from '../services/permissionRoleService';
import UserRoleService from '../services/userRoleService';

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      Logger.info(`[Permission Check] Init permission check: ${requiredPermission}`);

      const authService = container.resolve(AuthService);
      const userRoleService = container.resolve(UserRoleService);
      const rolePermissionService = container.resolve(PermissionRoleService);

      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        Logger.warn(`[Permission Check] Fail - Token not provided`);
        throw ApiError.unauthorized('No token provided');
      }

      const { id } = authService.verifyToken(token);

      const userRoles = await userRoleService.findRolesByUser(id);
      if (!userRoles?.length) {
        Logger.warn(`[Permission Check] Fail - No roles assigned for user ${id}`);
        throw ApiError.forbidden('No roles assigned');
      }

      const roleIds = userRoles.map(role => role.roleId instanceof ObjectId ? role.roleId.toString() : role.roleId);

      const hasPermission = await rolePermissionService.checkPermission(roleIds, requiredPermission);
      if (!hasPermission) {
        Logger.warn(`[Permission Check] Fail - User ${id} lacks permission: ${requiredPermission}`);
        throw ApiError.forbidden('Permission denied');
      }

      Logger.info(`[Permission Check] Success - User ${id} has permission: ${requiredPermission}`);
      next();
    } catch (error) {
      Logger.error(`[Permission Check] Error verifying permission: ${error}`);
      next(error);
    }
  };
};
