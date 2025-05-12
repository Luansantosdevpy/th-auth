import { inject, injectable } from 'tsyringe';

import type { UserRoleRequest } from '../../domain/interfaces/input/userRoleRequest';
import type UserRoleRepositoryInterface from '../../domain/interfaces/repositories/userRoleRepositoryInterface';
import type { UserRole } from '../../domain/models/userRole';

@injectable()
export default class UserRoleService {
  constructor(
    @inject('UserRoleRepositoryInterface')
    public readonly userRoleRepository: UserRoleRepositoryInterface
  ) {}

  public async assignRoleToUser(data: UserRoleRequest): Promise<UserRole> {
    const { userId, roleId } = data;

    const newUserRole = await this.userRoleRepository.assignRoleToUser({ userId, roleId });

    return newUserRole;
  }

  public async findRolesByUser(user: string): Promise<UserRole[] | null> {
    return await this.userRoleRepository.findRolesByUser(user);
  }

  public async deleteRoleToUser(data: UserRoleRequest): Promise<void> {
    const { userId, roleId } = data;
    const deletedRole = await this.userRoleRepository.deleteRoleToUser({userId, roleId})

     console.log(deletedRole);
  }
}
