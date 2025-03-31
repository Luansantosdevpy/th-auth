import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { createMockRepositories } from '../../__mocks__/repositories.mock';
import { 
  createMockUser, 
  createMockUserRole, 
  createMockRole, 
  createMockUserAttributes 
} from '../../__mocks__/userData.mock';
import AuthService from '../../../src/application/services/authService';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../../src/infrastructure/log/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

describe('AuthService', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, JWT_SECRET: 'test-secret' };
  });
  
  afterAll(() => {
    process.env = originalEnv;
  });

  describe('signup', () => {
    it('should throw error if email or password is missing', async () => {
      const { userRepository, userRoleRepository, roleRepository } = createMockRepositories();
      const authService = new AuthService(userRepository, userRoleRepository, roleRepository);
      
      await expect(authService.signup({ name: 'Test User' })).rejects.toThrow('Email and password are required');
      await expect(authService.signup({ email: 'test@example.com' })).rejects.toThrow('Email and password are required');
    });

    it('should throw error if user already exists', async () => {
      const { userRepository, userRoleRepository, roleRepository } = createMockRepositories();
      userRepository.findByEmail.mockResolvedValue(createMockUser());
      
      const authService = new AuthService(userRepository, userRoleRepository, roleRepository);
      
      await expect(authService.signup({ 
        email: 'test@example.com', 
        password: 'password123' 
      })).rejects.toThrow('User already exists');
    });

    it('should create a new user with hashed password', async () => {
      const { userRepository, userRoleRepository, roleRepository } = createMockRepositories();
      userRepository.findByEmail.mockResolvedValue(null);
      
      const mockUser = createMockUser();
      userRepository.createUser.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      
      const authService = new AuthService(userRepository, userRoleRepository, roleRepository);
      
      const result = await authService.signup({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        organizationId: 'org123',
      });
      
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        organizationId: 'org123',
        createdAt: expect.any(Date),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('signin', () => {
    it('should throw error if user not found', async () => {
      const { userRepository, userRoleRepository, roleRepository } = createMockRepositories();
      userRepository.findByEmail.mockResolvedValue(null);
      
      const authService = new AuthService(userRepository, userRoleRepository, roleRepository);
      
      await expect(authService.signin('test@example.com', 'password123')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password does not match', async () => {
      const { userRepository, userRoleRepository, roleRepository } = createMockRepositories();
      userRepository.findByEmail.mockResolvedValue(createMockUser());
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      const authService = new AuthService(userRepository, userRoleRepository, roleRepository);
      
      await expect(authService.signin('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    it('should return token and user data if credentials are valid', async () => {
      const { userRepository, userRoleRepository, roleRepository } = createMockRepositories();
      
      const mockUser = createMockUser();
      const mockUserRole = createMockUserRole();
      const mockRole = createMockRole();
      const mockUserAttributes = createMockUserAttributes();
      
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userRepository.findUserAttributes.mockResolvedValue(mockUserAttributes);
      userRoleRepository.findRolesByUser.mockResolvedValue([mockUserRole]);
      roleRepository.findRoleById.mockResolvedValue(mockRole);
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-jwt-token');
      
      const authService = new AuthService(userRepository, userRoleRepository, roleRepository);
      
      const result = await authService.signin('test@example.com', 'password123');
      
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '123', email: 'test@example.com', organizationId: 'org123' },
        'test-secret',
        { expiresIn: '1h' }
      );
      
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          userId: '123',
          email: 'test@example.com',
          name: 'Test User',
          roleId: 'role123',
          roleName: 'Admin',
          phone: '1234567890',
          photo: 'photo-url.jpg',
          organizationId: 'org123',
        },
      });
    });

    it('should handle user without roles', async () => {
      const { userRepository, userRoleRepository, roleRepository } = createMockRepositories();
      
      const mockUser = createMockUser();
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userRepository.findUserAttributes.mockResolvedValue({});
      userRoleRepository.findRolesByUser.mockResolvedValue([]);
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-jwt-token');
      
      const authService = new AuthService(userRepository, userRoleRepository, roleRepository);
      
      const result = await authService.signin('test@example.com', 'password123');
      
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          userId: '123',
          email: 'test@example.com',
          name: 'Test User',
          organizationId: 'org123',
        },
      });
      
      expect(roleRepository.findRoleById).not.toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    it('should return decoded token if valid', () => {
      const { userRepository, userRoleRepository, roleRepository } = createMockRepositories();
      
      const mockDecodedToken = {
        id: '123',
        email: 'test@example.com',
        organizationId: 'org123',
      };
      
      (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
      
      const authService = new AuthService(userRepository, userRoleRepository, roleRepository);
      
      const result = authService.verifyToken('valid-token');
      
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(result).toEqual(mockDecodedToken);
    });

    it('should throw error if token is invalid', () => {
      const { userRepository, userRoleRepository, roleRepository } = createMockRepositories();
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      const authService = new AuthService(userRepository, userRoleRepository, roleRepository);
      
      expect(() => authService.verifyToken('invalid-token')).toThrow('Invalid or expired token');
    });
  });
});