import { injectable } from 'tsyringe';

import type PermissionRoleRepositoryInterface from '../../../domain/interfaces/repositories/permissionRoleRepositoryInterface';
import type { PermissionRole } from '../../../domain/models/rolePermission';
import PermissionRoleSchema from '../schemas/permissionRoleSchema';

@injectable()
export default class PermissionRoleRepository implements PermissionRoleRepositoryInterface {
  public async findPermissionsByRole(roleId: string): Promise<PermissionRole[]> {
    return await PermissionRoleSchema.find({ roleId }).lean();
  }

  public async assignPermissionsToRole(permissionRoles: PermissionRole[]): Promise<PermissionRole[]> {
    return await PermissionRoleSchema.insertMany(permissionRoles);
  }

  public async updateAssignedAt(roleId: string): Promise<void> {
    await PermissionRoleSchema.updateMany({ roleId }, { assignedAt: new Date() });
  }
  public async findPermissionsByRoleId(roleId: string): Promise<PermissionRole | null> {
    return await PermissionRoleSchema.findOne({ roleId }).lean();
  }
}
