import type { ObjectId } from 'mongodb';
import { injectable } from 'tsyringe';

import type PermissionRepositoryInterface from '../../../domain/interfaces/repositories/permissionRepositoryInterface';
import type { Permission } from '../schemas/permissionSchema';
import PermissionSchema from '../schemas/permissionSchema';

@injectable()
export default class PermissionRepository implements PermissionRepositoryInterface {
  public async createPermission(permission: Partial<Permission>): Promise<Permission> {
    const newPermission = new PermissionSchema(permission);
    return newPermission.save();
  }

  public async getAllPermissions(): Promise<Permission[]> {
    return await PermissionSchema.find().lean();
  }

  public async getPermissionByName(name: string): Promise<Permission | null> {
    return await PermissionSchema.findOne({ name }).lean();
  }

  public async findPermissionsByIds(permissionIds: ObjectId[]): Promise<Permission[]> {
    return await PermissionSchema.find({ _id: { $in: permissionIds } }).select('_id name').lean();
  }
}
