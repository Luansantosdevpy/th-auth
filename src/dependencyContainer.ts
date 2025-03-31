import type { AxiosStatic } from 'axios';
import axios from 'axios';
import { instanceCachingFactory, type DependencyContainer } from 'tsyringe';

import AuthService from './application/services/authService';
import HealthCheckService from './application/services/healthCheckService';
import type HealthCheckRepositoryInterface from './domain/interfaces/repositories/healthCheckRepositoryInterface';
import type PermissionRepositoryInterface from './domain/interfaces/repositories/permissionRepositoryInterface';
import type PermissionRoleRepositoryInterface from './domain/interfaces/repositories/permissionRoleRepositoryInterface';
import type RoleRepositoryInterface from './domain/interfaces/repositories/roleRepositoryInterface';
import type UserRepositoryInterface from './domain/interfaces/repositories/userRepositoryInterface';
import type UserRoleRepositoryInterface from './domain/interfaces/repositories/userRoleRepositoryInterface';
import HealthCheckRepository from './infrastructure/data/repositories/healthCheckRepository';
import PermissionRepository from './infrastructure/data/repositories/permissionRepository';
import PermissionRoleRepository from './infrastructure/data/repositories/permissionRoleRepository';
import RoleRepository from './infrastructure/data/repositories/roleRepository';
import UserRepository from './infrastructure/data/repositories/userRepository';
import UserRoleRepository from './infrastructure/data/repositories/userRoleRepository';
import Logger from './infrastructure/log/logger';

export default async (container: DependencyContainer): Promise<void> => {
  Logger.debug('Dependency container initializing...');

  container.register<HealthCheckRepositoryInterface>(
    'HealthCheckRepositoryInterface',
    {
      useClass: HealthCheckRepository
    }
  );

  container.register<HealthCheckService>('HealthCheckService', {
    useClass: HealthCheckService
  });

  container.register<UserRepositoryInterface>('UserRepositoryInterface', {
    useClass: UserRepository,
  });

  container.register<AuthService>('AuthService', {
    useClass: AuthService,
  });

  container.register<PermissionRepositoryInterface>('PermissionRepositoryInterface', {
    useClass: PermissionRepository,
  });

  container.register<RoleRepositoryInterface>('RoleRepositoryInterface', {
    useClass: RoleRepository,
  });

  container.register<UserRoleRepositoryInterface>('UserRoleRepositoryInterface', {
    useClass: UserRoleRepository,
  });

  container.register<PermissionRoleRepositoryInterface>('PermissionRoleRepositoryInterface', {
    useClass: PermissionRoleRepository,
  });

  container.register<AxiosStatic>('Axios', {
    useFactory: instanceCachingFactory(() => axios)
  });

  Logger.debug('Dependency container initialized!');
};
