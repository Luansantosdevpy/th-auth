import type { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

import RoleService from '../../application/services/roleService';
import type { Role } from '../../domain/models/role';
import Logger from '../../infrastructure/log/logger';
import { successResponse } from '../../infrastructure/utils/responseFormatter';
import { BaseController } from '../controllers/baseController';

@injectable()
export default class RoleController extends BaseController {
  public createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('RoleController - createRole - Request Received');

      const { name, description, organizationId } = req.body as Role;

      const roleService = this.resolve(RoleService);
      const faceGroup = await roleService.createRole({ name, description, organizationId });

      Logger.debug('RoleController - createRole - Role created successfully');
      return res.status(201).json(successResponse(201, 'Role created successfully', faceGroup));
    }, req, res, next);
  };

  public getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('RoleController - getAllRoles - Request Received');

      const roleService = this.resolve(RoleService);
      const roleList = await roleService.getAllRoles();

      Logger.debug('RoleController - getAllRoles - Retrieved successfully');
      return res.status(200).json(successResponse(200, 'Role retrieved successfully', roleList));
    }, req, res, next);
  };

  public getRoleByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.execute(async () => {
      Logger.debug('RoleController - getRoleByName - Request Received');

      const { name } = req.params;

      const roleService = this.resolve(RoleService);
      const role = await roleService.getRoleByName(name);

      Logger.debug('RoleController - getRoleByName - Retrieved successfully');
      return res.status(200).json(successResponse(200, 'role retrieved successfully', role));
    }, req, res, next);
  };
}
