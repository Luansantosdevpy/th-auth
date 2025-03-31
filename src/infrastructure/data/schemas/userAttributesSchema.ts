import { Schema, model, type Document } from 'mongoose';

type AddressUser = {
  neighborhood: string;
  number: number;
  country: string;
  province: string;
  city: string;
  zip: string;
};

export interface UserAttributesDocument extends Document {
  userId: string;
  photo?: string;
  phone?: string;
  address?: AddressUser;
  name?: string;
  birthday?: string;
  sex?: string;
}

const AddressSchema = new Schema<AddressUser>({
  neighborhood: { type: String, required: true },
  number: { type: Number, required: true },
  country: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true }
});

const UserAttributesSchema = new Schema<UserAttributesDocument>({
  userId: { type: String, required: true, unique: true },
  photo: { type: String },
  phone: { type: String },
  address: { type: AddressSchema },
  name: { type: String },
  birthday: { type: Date },
  sex: { type: String, enum: ['M', 'F', 'Other'] }
});

export default model<UserAttributesDocument>('user_attributes', UserAttributesSchema);
