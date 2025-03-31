import { injectable } from 'tsyringe';

import type UserRepositoryInterface from '../../../domain/interfaces/repositories/userRepositoryInterface';
import type { User } from '../../../domain/models/user';
import type { UserAttributes } from '../../../domain/models/userAttributes';
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
}
