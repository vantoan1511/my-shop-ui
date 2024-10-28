export interface PagedResponse<T = unknown> {
  page: number;
  size: number;
  totalItems: number;
  numberOfItems: number;
  items: T[];
  hasNext: boolean;
  hasPrevious: boolean;
}
