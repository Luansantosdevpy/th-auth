import type { Role } from '../../models/role';

export default interface RoleRepositoryInterface {
  createRole(user: Partial<Role>): Promise<Role>;
  findAllRoles(): Promise<Role[]>;
  findRoleByName(name: string): Promise<Role | null>;
  findRoleById(id: string): Promise<Role | null>;
}
