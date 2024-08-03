export interface PageResponse<T> {
    totalOfItems: number;
    numberOfItems: number;
    page: number;
    size: number;
    items: T[];
}