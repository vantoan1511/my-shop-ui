export interface Response<T = unknown> {
  page: number;
  size: number;
  totalUsers: number;
  numberOfUsers: number;
  users: T[];
  hasNext: boolean;
  hasPrevious: boolean;
}
