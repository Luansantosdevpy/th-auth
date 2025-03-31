import { Schema, model } from 'mongoose';

export interface PermissionRole {
  permissionId: string[];
  roleId: string;
  assignedAt: Date;
}

const PermissionRoleSchema = new Schema<PermissionRole>({
  permissionId: { type: [String], required: true },
  roleId: { type: String, ref: 'Role', required: true },
  assignedAt: { type: Date, default: Date.now },
});

export default model<PermissionRole>('permission_role', PermissionRoleSchema);
