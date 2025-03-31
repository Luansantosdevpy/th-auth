import type { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

import PermissionService from '../../application/services/permissionService';
import type { Permission } from '../../domain/models/permission';
import Logger from '../../infrastructure/log/logger';
import { successResponse } from '../../infrastructure/utils/responseFormatter';
import { BaseController } from '../controllers/baseController';

@injectable()
export default class PermissionController extends BaseController {
  public createPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('PermissionController - createPermission - Request Received');

      const { name, description, organizationId } = req.body as Permission;

      const permissionService = this.resolve(PermissionService);
      const faceGroup = await permissionService.createPermission({ name, description, organizationId });

      Logger.debug('PermissionController - createPermission - Permission created successfully');
      return res.status(201).json(successResponse(201, 'Permission created successfully', faceGroup));
    }, req, res, next);
  };

  public getAllPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('PermissionController - getAllPermissions - Request Received');

      const permissionService = this.resolve(PermissionService);
      const permissionList = await permissionService.getAllPermissions();

      Logger.debug('PermissionController - getAllPermissions - Retrieved successfully');
      return res.status(200).json(successResponse(200, 'Permission retrieved successfully', permissionList));
    }, req, res, next);
  };

  public getPermissionByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('PermissionController - getPermissionByName - Request Received');

      const { name } = req.params;

      const permissionService = this.resolve(PermissionService);
      const permission = await permissionService.getPermissionByName(name);

      Logger.debug('PermissionController - getPermissionByName - Retrieved successfully');
      return res.status(200).json(successResponse(200, 'permission retrieved successfully', permission));
    }, req, res, next);
  };
}
