import { PaymentStatus } from '@/types';

const PaymentStatusColor = (status: string) => {
  let bg_class = '';
  if (status === PaymentStatus.PENDING) {
    bg_class = 'bg-[#EAB308]';
  } else if (status === PaymentStatus.CANCELED) {
    bg_class = 'bg-[#D9D9D9]';
  } else if (status === PaymentStatus.PAID) {
    bg_class = 'bg-[#10B981]';
  } else {
    bg_class = 'bg-accent';
  }

  return bg_class;
};

export default PaymentStatusColor;
