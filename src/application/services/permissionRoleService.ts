import { inject, injectable } from 'tsyringe';

import type PermissionRoleRepositoryInterface from '../../domain/interfaces/repositories/permissionRoleRepositoryInterface';
import type { PermissionRole } from '../../domain/models/rolePermission';
import { ApiError } from '../../infrastructure/error/apiError';
import PermissionService from './permissionService';

@injectable()
export default class PermissionRoleService {
  constructor(
    @inject('PermissionRoleRepositoryInterface')
    public readonly permissionRoleRepository: PermissionRoleRepositoryInterface,
    @inject(PermissionService)
    public readonly permissionService: PermissionService
  ) {}

  public async assignPermissionsToRole(data: { permissionIds: string[]; roleId: string }): Promise<PermissionRole[]> {
    const { permissionIds, roleId } = data;

    const existingPermissions = await this.permissionRoleRepository.findPermissionsByRole(roleId);
    const existingPermissionIds = new Set(existingPermissions.flatMap(p => p.permissionId));

    const newPermissions = permissionIds.filter(id => !existingPermissionIds.has(id));

    if (newPermissions.length === 0) {
      await this.permissionRoleRepository.updateAssignedAt(roleId);
      return existingPermissions;
    }

    const permissionRoles: PermissionRole = {
      permissionId: newPermissions,
      roleId,
      assignedAt: new Date(),
    };

    return await this.permissionRoleRepository.assignPermissionsToRole([permissionRoles]);
  }

  public async findPermissionsByRole(role: string): Promise<PermissionRole[] | null> {
    return await this.permissionRoleRepository.findPermissionsByRole(role);
  }

  public async checkPermission(userRoles: string[], requiredPermission: string): Promise<boolean> {
    for (const roleId of userRoles) {
      const permissions = await this.findPermissionsByRole(roleId);

      if (!permissions) throw ApiError.forbidden('Permission denied');

      const permissionNames = await this.permissionService.findPermissionNamesByIds(
        permissions.flatMap(p => p.permissionId)
      );

      if (permissionNames.includes(requiredPermission)) {
        return true;
      }
    }
    return false;
  }
}
