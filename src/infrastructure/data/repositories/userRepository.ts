import { injectable } from 'tsyringe';

import type UserRepositoryInterface from '../../../domain/interfaces/repositories/userRepositoryInterface';
import type { User } from '../../../domain/models/user';
import type { UserAttributes } from '../../../domain/models/userAttributes';
import Logger from '../../log/logger';
import UserAttributesModel from '../schemas/userAttributesSchema';
import UserModel from '../schemas/userSchema';

@injectable()
export default class UserRepository implements UserRepositoryInterface {
  public async assignAttributesToUser(userAttributes: UserAttributes): Promise<UserAttributes> {
    const { userId } = userAttributes;

    const existingAttributes = await UserAttributesModel.findOne({ userId });

    if (existingAttributes) {
      await UserAttributesModel.updateOne({ userId }, { $set: userAttributes });
      return { ...existingAttributes.toObject(), ...userAttributes };
    }

    const newAttributes = new UserAttributesModel(userAttributes);
    const savedAttributes = await newAttributes.save();
    
    return savedAttributes.toJSON() as unknown as UserAttributes;
  }

  public async createUser(user: Partial<User>): Promise<User> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser.toJSON() as unknown as User;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean();
    return user as User | null;
  }

  public async findUserById(userId: string): Promise<User | null> {
    const user = await UserModel.findById(userId).lean();
    return user as User | null;
  }

  public async findUserAttributes(userId: string): Promise<UserAttributes | null> {
    const user = await UserAttributesModel.findOne({ userId }).lean();
    return user as UserAttributes | null;
  }

  public async findUserPermissions(userId: string): Promise<string[]> {
    try {
      const user = await UserModel.findById(userId).populate('permissions').lean();

      if (!user) {
        Logger.warn(`UserRepository - findUserPermissions - User not found: ${userId}`);
        return [];
      }

      Logger.debug(`UserRepository - findUserPermissions - Permissions found for user ${userId}:`, user.permissions);
      return user.permissions || [];
    } catch (error) {
      Logger.error(`UserRepository - findUserPermissions - Error fetching permissions for user ${userId}:`, error);
      throw error;
    }
  }
}
