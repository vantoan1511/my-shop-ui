export interface Sort {
    sortBy?: SortField;
    ascending?: boolean;
}

export enum SortField {
    CREATED_AT = 'CREATED_AT',
    FIRST_NAME = 'FIRST_NAME',
    LAST_NAME = 'LAST_NAME',
    EMAIL = 'EMAIL',
    USERNAME = 'USERNAME',
    VIEW_COUNT = 'VIEW_COUNT',
    STOCK_QUANTITY = 'STOCK_QUANTITY',
    NAME = 'NAME',
    SLUG = 'SLUG',
    BASE_PRICE = 'BASE_PRICE',
    SALE_PRICE = 'SALE_PRICE'
}
