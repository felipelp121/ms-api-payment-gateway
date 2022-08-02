export type AddressDTO = {
  id: number;
  user_id: number;
  street: string | null;
  number: number | null;
  complement: string | null;
  locality: string | null;
  city: string | null;
  region: string | null;
  region_code: string | null;
  country: string | null;
  postal_code: number | null;
  created_at: Date;
  updated_at: Date;
};

export type DeleteAddressDTO = {
  id: number;
  user_id: number;
};
