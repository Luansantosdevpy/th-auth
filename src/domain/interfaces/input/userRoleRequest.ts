import type { Types } from "mongoose";

export interface UserRoleRequest {
    userId: Types.ObjectId;
    roleId: Types.ObjectId;
}