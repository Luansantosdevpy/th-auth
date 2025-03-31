import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  organizationId: string;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, required: true },
  organizationId: { type: String }
});

export default model<UserDocument>('User', UserSchema);
