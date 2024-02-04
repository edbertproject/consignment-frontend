import { OrderStatus } from '@/types';

const StatusColor = (status: string) => {
  let bg_class = '';
  if (status === OrderStatus.WAITING_PAYMENT) {
    bg_class = 'bg-[#EAB308]';
  } else if (status === OrderStatus.PROCESS) {
    bg_class = 'bg-[#F59E0B]';
  } else if (status === OrderStatus.FINISH) {
    bg_class = 'bg-[#9CA3AF]';
  } else if (
    status === OrderStatus.EXPIRED ||
    status === OrderStatus.CANCELED
  ) {
    bg_class = 'bg-[#D9D9D9]';
  } else if (status === OrderStatus.PAID) {
    bg_class = 'bg-[#10B981]';
  } else if (status === OrderStatus.PROBLEM) {
    bg_class = 'bg-[#EF4444]';
  } else {
    bg_class = 'bg-accent';
  }

  return bg_class;
};

export default StatusColor;
