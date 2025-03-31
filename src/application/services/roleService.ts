import { inject, injectable } from 'tsyringe';

import type RoleRepositoryInterface from '../../domain/interfaces/repositories/roleRepositoryInterface';
import type { Role } from '../../domain/models/role';

@injectable()
export default class RoleService {
  constructor(
    @inject('RoleRepositoryInterface')
    public readonly roleRepository: RoleRepositoryInterface
  ) {}

  public async createRole(role: Partial<Role>): Promise<Role> {
    const { name, description, organizationId } = role;

    const newEquipment = await this.roleRepository.createRole({
        name,
        description,
        organizationId,
        createdAt: new Date()
    });

    return newEquipment;
  }

  public async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.findAllRoles();
  }

  public async getRoleByName(name: string): Promise<Role | null> {
    return await this.roleRepository.findRoleByName(name);
  }
}
