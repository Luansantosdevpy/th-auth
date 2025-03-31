import type { ObjectId } from 'mongodb';

import type { Permission } from '../../models/permission';

export default interface PermissionRepositoryInterface {
  createPermission(user: Partial<Permission>): Promise<Permission>;
  getAllPermissions(): Promise<Permission[]>;
  getPermissionByName(name: string): Promise<Permission | null>;
  findPermissionsByIds(permissionIds: ObjectId[]): Promise<Permission[]>;
}
