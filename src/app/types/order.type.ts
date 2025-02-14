import {Cart} from "./cart.type";

export enum OrderStatus {
  'CREATED' = 'CREATED',
  'PENDING' = 'PENDING',
  'ACCEPTED' = 'ACCEPTED',
  'DECLINED' = 'DECLINED',
  'AWAITING_PICKUP' = 'AWAITING_PICKUP',
  'AWAITING_SHIPPING' = 'AWAITING_SHIPPING',
  'SHIPPED' = 'SHIPPED',
  'COMPLETED' = 'COMPLETED',
  'CANCELED' = 'CANCELED'
}

export const StatusTransition = new Map<OrderStatus, OrderStatus[]>([
  [OrderStatus.CREATED, []],
  [OrderStatus.PENDING, [OrderStatus.CREATED]],
  [OrderStatus.ACCEPTED, [OrderStatus.PENDING]],
  [OrderStatus.DECLINED, [OrderStatus.PENDING]],
  [OrderStatus.AWAITING_PICKUP, [OrderStatus.ACCEPTED]],
  [OrderStatus.AWAITING_SHIPPING, [OrderStatus.AWAITING_PICKUP]],
  [OrderStatus.SHIPPED, [OrderStatus.AWAITING_SHIPPING]],
  [OrderStatus.COMPLETED, [OrderStatus.SHIPPED]],
  [OrderStatus.CANCELED, [
    OrderStatus.CREATED,
    OrderStatus.PENDING,
    OrderStatus.ACCEPTED,
  ]]
]);

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
