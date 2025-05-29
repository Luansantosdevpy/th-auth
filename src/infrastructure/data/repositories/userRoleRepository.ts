// src/infrastructure/data/repositories/userRoleRepository.ts
import { injectable } from 'tsyringe';

import type { UserRoleRequest } from '../../../domain/interfaces/input/userRoleRequest';
import type UserRoleRepositoryInterface from '../../../domain/interfaces/repositories/userRoleRepositoryInterface';
import type { UserRole } from '../schemas/userRoleSchema';
import UserRoleSchema from '../schemas/userRoleSchema';

@injectable()
export default class UserRoleRepository implements UserRoleRepositoryInterface {
  public async assignRoleToUser(userRole: UserRoleRequest): Promise<UserRole> {
    const newUserRole = new UserRoleSchema(userRole);
    return newUserRole.save();
  }

  public async findRolesByUser(userId: string): Promise<UserRole[]> {
    return UserRoleSchema.find({ userId }).lean();
  }

  public async findRolesByUserId(userId: string): Promise<UserRole | null> {
    return UserRoleSchema.findOne({ userId }).lean();
  }
}