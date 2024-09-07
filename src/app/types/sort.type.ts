export interface Sort {
  sort_by?: SortField;
  descending?: boolean;
}

export enum SortField {
  CREATED_AT = 'CREATED_AT',
  FIRST_NAME = 'FIRST_NAME',
  LAST_NAME = 'LAST_NAME',
  EMAIL = 'EMAIL',
  USERNAME = 'USERNAME',
}
