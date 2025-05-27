import { inject, injectable } from 'tsyringe';

import type UserRepositoryInterface from '../../domain/interfaces/repositories/userRepositoryInterface';
import type { UserAttributes } from '../../domain/models/userAttributes';
import { ApiError } from '../../infrastructure/error/apiError';
import Logger from '../../infrastructure/log/logger';
import AuthService from './authService';
import UserRoleService from './userRoleService';
import PermissionRoleService from './permissionRoleService';
import PermissionService from './permissionService';

@injectable()
export default class UserService {
  constructor(
    @inject('UserRepositoryInterface')
    public readonly userRepository: UserRepositoryInterface,
    @inject(UserRoleService)
    private readonly userRoleService: UserRoleService,
    @inject(AuthService)
    private readonly authService: AuthService,
    @inject(PermissionRoleService)
    private readonly permissionRoleService: PermissionRoleService,
    @inject(PermissionService)
    private readonly permissionService: PermissionService
  ) {}

  public async assignAttributesToUser(data: UserAttributes): Promise<UserAttributes> {
    const { userId, name, phone, photo, address, sex, birthday } = data;

    const userExists = await this.userRepository.findUserById(userId);

    if (!userExists) {
        throw ApiError.notFound('Not found user');
    }

    const userAttributes = await this.userRepository.assignAttributesToUser({
        userId, name, phone, photo, address, sex, birthday
    });

    return userAttributes;
  }

  public async verifyUserPermission(token: string | undefined, requiredPermission: string | undefined): Promise<boolean> {
    try {
      if (!token) {
        Logger.error('UserService - verifyUserPermission - Token not provided');
        throw ApiError.badRequest('Token not provided');
      }
      if (!requiredPermission) {
        Logger.error('UserService - verifyUserPermission - Required permission not provided');
        throw ApiError.badRequest('Required permission not provided');
      }

      const decodedToken = this.authService.verifyToken(token);
      Logger.debug('UserService - verifyUserPermission - Token decoded:', decodedToken);

      const user = await this.userRepository.findUserById(decodedToken.id);
      
      if (!user) {
        Logger.error('UserService - verifyUserPermission - User not found');
        throw ApiError.notFound('User not found');
      }
      const role = await this.userRoleService.findRolesByUserId(user._id.toString());
      if (!role) {
        Logger.error('UserRoleService - verifyUserPermission - role not found');
        throw ApiError.notFound('Role not found');
      }
      const permissionsRole = await this.permissionRoleService.findPermissionsByRoleId(role.roleId.toString());
      const permissionIds = permissionsRole?.permissionId || [];
      const permissionNames = await this.permissionService.findPermissionNamesByIds(permissionIds);
      const hasPermission = permissionNames?.includes(requiredPermission) || false;
      if (!hasPermission) {
        Logger.error('UserService - verifyUserPermission - Permission denied');
        throw ApiError.forbidden('Permission denied');
      }

      Logger.debug('UserService - verifyUserPermission - Permission granted');
      return hasPermission;
    } catch (error) {
      Logger.error('UserService - verifyUserPermission - Error:', error);
      throw error;
    }
  }
}