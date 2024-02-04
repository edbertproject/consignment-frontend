import { OrderStatusBuyer, OrderStatusDetail } from '@/types';

export const ORDER_BUYER_STATUS = [
  OrderStatusBuyer.PENDING,
  OrderStatusBuyer.CANCELED,
  OrderStatusBuyer.PROCESSED,
  OrderStatusBuyer.ON_DELIVERY,
  OrderStatusBuyer.ARRIVED,
  OrderStatusBuyer.COMPLAIN,
  OrderStatusBuyer.COMPLETE,
];

export const ORDER_BUYER_MAIN_STATUS = [
  OrderStatusBuyer.PENDING,
  OrderStatusBuyer.PROCESSED,
  OrderStatusBuyer.ON_DELIVERY,
  OrderStatusBuyer.ARRIVED,
  OrderStatusBuyer.COMPLETE,
];

export const filterOrderStatus = (
  orderStatuses: OrderStatusDetail[],
  lastStatus: OrderStatusBuyer
) => {
  const currentStatuses = [...orderStatuses].reverse().map((e) => e.status);

  let tempStatuses: string[];
  if (lastStatus === OrderStatusBuyer.CANCELED) {
    tempStatuses = [...currentStatuses];
  } else if (lastStatus === OrderStatusBuyer.COMPLAIN) {
    tempStatuses = [...currentStatuses, OrderStatusBuyer.COMPLETE];
  } else {
    const lastStep = currentStatuses.slice(-1).pop();

    if (lastStep) {
      const currentLastStep = ORDER_BUYER_MAIN_STATUS.findIndex(
        (value) => value === lastStep
      );
      tempStatuses = [
        ...currentStatuses,
        ...ORDER_BUYER_MAIN_STATUS.slice(currentLastStep + 1),
      ];
    } else {
      tempStatuses = ORDER_BUYER_MAIN_STATUS;
    }
  }

  return {
    statuses: tempStatuses.map((status, index) => {
      return {
        name: `Order ${status}`,
        serial: index + 1,
      };
    }),
    current: tempStatuses.findIndex((value) => lastStatus === value),
  };
};
