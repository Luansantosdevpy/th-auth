import type { PermissionRole } from "../../models/rolePermission";

export default interface PermissionRoleRepositoryInterface {
  findPermissionsByRole(roleId: string): Promise<PermissionRole[]>;
  findPermissionsByRoleId(roleId: string): Promise<PermissionRole>;
  assignPermissionsToRole(permissionRoles: PermissionRole[]): Promise<PermissionRole[]>;
  updateAssignedAt(roleId: string): Promise<void>;
}
