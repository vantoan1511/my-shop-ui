import {Product} from "./product.type";

export interface Cart {
    id: number
    quantity: number
    createdAt: string
    modifiedAt: string
    username: string
    productSlug: string
}


export interface CartItem {
    product: Product
    quantity: number
}

export interface AddToCartRequest {
    productSlug: string
    quantity: number
}