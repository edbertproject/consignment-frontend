import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import StatusColor from '@/components/orders/status-color';
import Badge from '@/components/ui/badge';
import { SpinnerLoader } from '@/components/ui/loaders/spinner/spinner';
import Button from '@/components/ui/button';
import { Order, OrderStatus } from '@/types';
import PaymentStatusColor from '@/components/orders/payment-status-color';
import { useModalAction } from '@/components/ui/modal/modal.context';

interface OrderViewHeaderPaymentProps {
  order: Order;
  wrapperClassName?: string;
  loading?: boolean;
}

export default function OrderViewHeaderPayment({
  order,
  wrapperClassName = 'lg:px-11 lg:py-5 p-6',
  loading = false,
}: OrderViewHeaderPaymentProps) {
  const { t } = useTranslation('common');

  return (
    <div className={cn(`bg-[#F7F8FA] ${wrapperClassName}`)}>
      <div className="mb-0 flex flex-col flex-wrap items-center justify-between gap-x-8 text-base font-bold text-heading sm:flex-row lg:flex-nowrap">
        <div
          className={`order-2 flex w-full max-w-full basis-full justify-between gap-6 xs:flex-nowrap sm:order-1`}
        >
          <div className="flex flex-wrap items-center">
            <span className="mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
              {t('text-bank')} :
            </span>
            <div className="w-full lg:w-auto">
              {order.invoice.payment_method?.name}
            </div>
          </div>
          <div className="flex flex-wrap items-center">
            <span className="mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
              {t('text-number')} :
            </span>
            <div className="w-full lg:w-auto">
              {order.invoice.payment_number}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
