import { ObjectId } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import type PermissionRepositoryInterface from '../../domain/interfaces/repositories/permissionRepositoryInterface';
import type { Permission } from '../../domain/models/permission';
import { ApiError } from '../../infrastructure/error/apiError';

@injectable()
export default class PermissionService {
  constructor(
    @inject('PermissionRepositoryInterface')
    public readonly permissionRepository: PermissionRepositoryInterface
  ) {}

  public async createPermission(permission: Partial<Permission>): Promise<Permission> {
    const { name, description, organizationId } = permission;

    if (!name || organizationId) {
      throw ApiError.badRequest('Name and organizationId are required');
    }

    const permissionExists = await this.permissionRepository.getPermissionByName(name);

    if (permissionExists) {
      throw ApiError.conflict('Already exist permission with this name');
    }

    const newPermission = await this.permissionRepository.createPermission({
        name,
        description,
        organizationId,
        createdAt: new Date()
    });

    return newPermission;
  }

  public async getAllPermissions(): Promise<Permission[]> {
    return await this.permissionRepository.getAllPermissions();
  }

  public async getPermissionByName(name: string): Promise<Permission | null> {
    return await this.permissionRepository.getPermissionByName(name);
  }

  public async findPermissionsByIds(permissionIds: string[]): Promise<Permission[]> {
    const objectIds = permissionIds.map(id => new ObjectId(id));
    return await this.permissionRepository.findPermissionsByIds(objectIds);
  }

  public async findPermissionNamesByIds(permissionIds: string[]): Promise<string[]> {
    const permissions = await this.findPermissionsByIds(permissionIds);
    return permissions.map(p => p.name);
  }
}
