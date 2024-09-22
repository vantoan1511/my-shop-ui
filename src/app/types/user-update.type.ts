export interface UserUpdate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
}

export interface CustomerProfileUpdate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
}
