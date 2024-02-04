import ProgressBox from '@/components/ui/progress-box/progress-box';
import {
  filterOrderStatus,
  ORDER_BUYER_MAIN_STATUS,
} from '@/lib/constants/order-status';
import { OrderStatusBuyer, OrderStatusDetail } from '@/types';

interface Props {
  lastStatus: OrderStatusBuyer;
  orderStatuses?: OrderStatusDetail[];
}

const OrderStatusProgressBox = ({ orderStatuses, lastStatus }: Props) => {
  const { statuses, current } = filterOrderStatus(
    orderStatuses ?? [],
    lastStatus
  );

  return <ProgressBox data={statuses} filledIndex={current} />;
};

export default OrderStatusProgressBox;
