import { Schema, model } from 'mongoose';

export interface Role {
  name: string;
  description?: string;
  createdAt: Date;
  organizationId: string;
}

const RoleSchema = new Schema<Role>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  organizationId: { type: String }
});

export default model<Role>('Role', RoleSchema);
