import { Schema, model } from 'mongoose';

export interface Permission {
  name: string;
  description?: string;
  createdAt: Date;
  organizationId: string;
}

const PermissionSchema = new Schema<Permission>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  organizationId: { type: String }
});

export default model<Permission>('Permission', PermissionSchema);
