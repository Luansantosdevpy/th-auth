type AddressUser = {
  neighborhood: string;
  number: number,
  country: string;
  province: string;
  city: string;
  zip: string;
}

export interface UserAttributes {
  userId: string;
  photo?: string;
  phone?: string;
  address?: AddressUser;
  name?: string;
  birthday?: string;
  sex?: string;
}