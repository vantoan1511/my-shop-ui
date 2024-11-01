import {Cart} from "./cart.type";

export enum ORDER_STATUS {
  'CREATED' = 'CREATED',
  'PENDING' = 'PENDING',
  'ACCEPTED' = 'ACCEPTED',
  'DECLINED' = 'DECLINED',
  'AWAITING_PICKUP' = 'AWAITING_PICKUP',
  'AWAITING_SHIPPING' = 'AWAITING_SHIPPING',
  'SHIPPED' = 'SHIPPED',
  'COMPLETED' = 'COMPLETED',
  'CANCELED' = 'CANCELED',
  'REFUNDED' = 'REFUNDED',
}

export const allowedCanceledStatus = ['CREATED', 'ACCEPTED', 'PENDING', 'AWAITING_PICKUP', 'AWAITING_SHIPPING', 'SHIPPED']


export interface OrderType {
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
