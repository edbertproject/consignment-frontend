import { PaymentStatus } from '@/types';

export const ORDER_STATUS = [
  { name: 'Order Pending', status: 'order-pending', serial: 1 },
  { name: 'Order Processing', status: 'order-processing', serial: 2 },
  {
    name: 'Order Out For Delivery',
    status: 'order-out-for-delivery',
    serial: 3,
  },
  {
    name: 'Order Arrived',
    status: 'order-arrived',
    serial: 4,
  },
  { name: 'Order Completed', status: 'order-completed', serial: 5 },
  { name: 'Order Cancelled', status: 'order-cancelled', serial: 5 },
  { name: 'Order Refunded', status: 'order-refunded', serial: 5 },
  { name: 'Order Failed', status: 'order-failed', serial: 5 },
];

export const filterOrderStatus = (
  orderStatus: any[],
  paymentStatus: PaymentStatus,
  currentStatusIndex: number
) => {
  if ([PaymentStatus.SUCCESS, PaymentStatus.COD].includes(paymentStatus)) {
    return currentStatusIndex > 4
      ? [...orderStatus.slice(0, 4), orderStatus[currentStatusIndex]]
      : orderStatus.slice(0, 5);
  }

  return currentStatusIndex > 4
    ? [...orderStatus.slice(0, 2), orderStatus[currentStatusIndex]]
    : orderStatus.slice(0, 5);
};
