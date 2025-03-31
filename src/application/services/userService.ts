import { inject, injectable } from 'tsyringe';

import type UserRepositoryInterface from '../../domain/interfaces/repositories/userRepositoryInterface';
import type { UserAttributes } from '../../domain/models/userAttributes';
import { ApiError } from '../../infrastructure/error/apiError';

@injectable()
export default class UserService {
  constructor(
    @inject('UserRepositoryInterface')
    public readonly userRepository: UserRepositoryInterface
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
}
