import { inject, injectable } from 'tsyringe';

import type UserRepositoryInterface from '../../domain/interfaces/repositories/userRepositoryInterface';
import type { UserAttributes } from '../../domain/models/userAttributes';
import { ApiError } from '../../infrastructure/error/apiError';
import Logger from '../../infrastructure/log/logger';
import AuthService from './authService';

@injectable()
export default class UserService {
  constructor(
    @inject('UserRepositoryInterface')
    public readonly userRepository: UserRepositoryInterface,
    
    @inject(AuthService)
    private readonly authService: AuthService

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

  public async verifyUserPermission(token: string, requiredPermission: string): Promise<boolean> {
    try {
      // Validação do token
      if (!token) {
        Logger.error('UserService - verifyUserPermission - Token not provided');
        throw ApiError.badRequest('Token not provided');
      }

      const decodedToken = this.authService.verifyToken(token);
      Logger.debug('UserService - verifyUserPermission - Token decoded:', decodedToken);
      
      const user = await this.userRepository.findUserById(decodedToken.id);
      if (!user) {
        Logger.error('UserService - verifyUserPermission - User not found');
        throw ApiError.forbidden('User not found');
      }

      const hasPermission = user.permissions?.includes(requiredPermission) || false;
      if (!hasPermission) {
        Logger.error('UserService - verifyUserPermission - Permission denied');
        throw ApiError.forbidden('Permission denied');
      }

      Logger.debug('UserService - verifyUserPermission - Permission granted');
      return hasPermission;
    } catch (error) {
      // Logar o erro para depuração
      Logger.error('UserService - verifyUserPermission - Error:', error);
      throw error;
    }
  }
}
