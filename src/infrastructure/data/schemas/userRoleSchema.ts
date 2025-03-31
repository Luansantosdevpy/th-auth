import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface UserRole {
  userId: Types.ObjectId;
  roleId: Types.ObjectId;
  assignedAt: Date;
}

const UserRoleSchema = new Schema<UserRole>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  assignedAt: { type: Date, default: Date.now },
});

export default model<UserRole>('User_Role', UserRoleSchema);
