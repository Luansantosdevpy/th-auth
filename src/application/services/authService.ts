import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import type RoleRepositoryInterface from '../../domain/interfaces/repositories/roleRepositoryInterface';
import type UserRepositoryInterface from '../../domain/interfaces/repositories/userRepositoryInterface';
import type UserRoleRepositoryInterface from '../../domain/interfaces/repositories/userRoleRepositoryInterface';
import type { User } from '../../domain/models/user';
import { ApiError } from '../../infrastructure/error/apiError';
import Logger from '../../infrastructure/log/logger';

type UserSigningReturn = {
  userId: string;
  email: string;
  name: string;
  roleId?: string;
  roleName?: string;
  phone?: string;
  photo?: string;
  organizationId: string;
};

@injectable()
export default class AuthService {
  constructor(
    @inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @inject('UserRoleRepositoryInterface')
    private readonly userRoleRepository: UserRoleRepositoryInterface,

    @inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface
  ) {}

  public async signup(userData: Partial<User>): Promise<User> {
    const { email, password, name, organizationId } = userData;

    if (!email || !password) {
      Logger.error('[auth] Params are required');
      throw ApiError.badRequest('Email and password are required');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      Logger.error(`[auth] User with email: ${email} already exists`);
      throw ApiError.conflict('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      organizationId,
      createdAt: new Date(),
    });
  }

  public async signin(email: string, password: string): Promise<{ token: string; user: UserSigningReturn }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const userData = await this.getUserData(user);
    const token = this.generateToken(user._id.toString(), user.email, userData.organizationId);

    return { token, user: userData };
  }

  private generateToken(userId: string, email: string, organizationId?: string): string {
    return jwt.sign({ id: userId, email, organizationId }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
  }

  private async getUserData(user: User): Promise<UserSigningReturn> {
    const userId = user._id.toString();
    const [userAttributes, userRoles] = await Promise.all([
      this.userRepository.findUserAttributes(userId),
      this.userRoleRepository.findRolesByUser(userId),
    ]);

    const roleId = userRoles[0]?.roleId?.toString();
    const role = roleId ? await this.roleRepository.findRoleById(roleId) : null;

    return {
      userId,
      email: user.email,
      name: user.name,
      roleId,
      roleName: role?.name,
      phone: userAttributes?.phone,
      photo: userAttributes?.photo,
      organizationId: user.organizationId,
    };
  }

  public verifyToken(token: string): { id: string; email: string, organizationId: string } {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string, organizationId: string };
    } catch {
      throw ApiError.unauthorized('Invalid or expired token');
    }
  }
}