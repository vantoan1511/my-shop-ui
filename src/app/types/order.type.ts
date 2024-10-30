export interface OrderType {
    paymentMethod: 'CASH' | 'BANK'
    shippingAddress: string
    items: OrderItem[]
}

export interface OrderItem {
    productSlug: string
    quantity: number
}