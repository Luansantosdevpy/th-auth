import type { Types } from "mongoose";

export interface UserRole {
  userId: Types.ObjectId;
  roleId: Types.ObjectId;
  assignedAt: Date;
}