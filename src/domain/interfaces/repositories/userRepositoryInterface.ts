import type { User } from '../../models/user';
import type { UserAttributes } from '../../models/userAttributes';

export default interface UserRepositoryInterface {
  createUser(user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findUserById(userId: string): Promise<User | null>;
  assignAttributesToUser(userAttributes: UserAttributes): Promise<UserAttributes>;
  findUserAttributes(userId: string): Promise<UserAttributes | null>;
}
