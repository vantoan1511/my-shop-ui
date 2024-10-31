import {Cart} from "./cart.type";

export interface CreateOrderRequest {
  paymentMethod: 'CASH' | 'BANKING'
  shippingAddress: string
  items: Cart[]
}

export interface Order {
  id: number
  orderStatus: string
  paymentMethod: string
  totalAmount: number
  shippingAddress: string
  createdAt: string
  modifiedAt: string
  username: string
  orderDetails?: OrderDetail[]
}

export interface OrderDetail {
  id: number
  quantity: number
  price: number
  productSlug: string
}
