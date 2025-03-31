import type { UserRole } from "../../models/userRole";
import type { UserRoleRequest } from "../input/userRoleRequest";

export default interface UserRoleRepositoryInterface {
  findRolesByUser(userId: string): Promise<UserRole[]>;
  assignRoleToUser(userRole: UserRoleRequest): Promise<UserRole>;
}
