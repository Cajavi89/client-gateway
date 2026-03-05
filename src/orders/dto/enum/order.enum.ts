export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

export const OrderStatusList = [
  OrderStatus.PAID,
  OrderStatus.PENDING,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELED,
];
