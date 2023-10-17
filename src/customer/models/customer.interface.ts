import { UserRole } from './customer.enum';

export interface Customer {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  token?: string;
  shop_id?: number;
}
