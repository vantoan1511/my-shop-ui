export interface Sort {
  sort_by?: string;
  descending?: boolean;
}

export interface PageRequest {
  page: number;
  size: number;
}
