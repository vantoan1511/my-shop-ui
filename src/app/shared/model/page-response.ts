export interface PageResponse<T = unknown> {
    totalOfItems: number;
    numberOfItems: number;
    page: number;
    size: number;
    hasNext?: boolean;
    hasPrev: boolean;
    items: T[];
}