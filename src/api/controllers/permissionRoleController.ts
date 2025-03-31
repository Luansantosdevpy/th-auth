import type { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

import PermissionRoleService from '../../application/services/permissionRoleService';
import Logger from '../../infrastructure/log/logger';
import { successResponse } from '../../infrastructure/utils/responseFormatter';
import { BaseController } from '../controllers/baseController';

@injectable()
export default class PermissionRoleController extends BaseController {
  public assignPermissionsToRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('PermissionRoleController - assignPermissionsToRole - Request Received');

      const { permissionIds, roleId } = req.body as { permissionIds: string[], roleId: string };

      const permissionRoleService = this.resolve(PermissionRoleService);
      const assignedPermissions = await permissionRoleService.assignPermissionsToRole({ permissionIds, roleId });

      Logger.debug('PermissionRoleController - assignPermissionsToRole - Permissions assigned successfully');
      return res.status(200).json(successResponse(200, 'Permissions assigned successfully', assignedPermissions));
    }, req, res, next);
  };

  public findPermissionsByRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('PermissionRoleController - findPermissionsByRole - Request Received');
      const { roleId } = req.body as { roleId: string };

      const permissionRoleService = this.resolve(PermissionRoleService);
      const roleList = await permissionRoleService.findPermissionsByRole(roleId);

      Logger.debug('PermissionRoleController - findPermissionsByRole - Retrieved successfully');
      return res.status(200).json(successResponse(200, 'Role retrieved successfully', roleList));
    }, req, res, next);
  };
}
