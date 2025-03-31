// src/infrastructure/data/repositories/roleRepository.ts
import { injectable } from 'tsyringe';

import type RoleRepositoryInterface from '../../../domain/interfaces/repositories/roleRepositoryInterface';
import type { Role } from '../schemas/roleSchema';
import RoleSchema from '../schemas/roleSchema';

@injectable()
export default class RoleRepository implements RoleRepositoryInterface {
  public async createRole(role: Partial<Role>): Promise<Role> {
    const newRole = new RoleSchema(role);
    return newRole.save();
  }

  public async findAllRoles(): Promise<Role[]> {
    return await RoleSchema.find().populate('permissions').lean();
  }

  public async findRoleByName(name: string): Promise<Role | null> {
    return await RoleSchema.findOne({ name }).populate('permissions').lean();
  }

  public async findRoleById(id: string): Promise<Role | null> {
    return await RoleSchema.findById(id).lean();
  }
}
