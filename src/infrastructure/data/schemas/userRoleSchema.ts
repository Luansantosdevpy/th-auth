import { Schema, model } from 'mongoose';

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: Date;
}

const UserRoleSchema = new Schema<UserRole>({
  userId: { type: String, required: true },
  roleId: { type: String, required: true },
  assignedAt: { type: Date, default: Date.now },
});

export default model<UserRole>('user_role', UserRoleSchema);
