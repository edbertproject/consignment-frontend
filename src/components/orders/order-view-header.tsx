import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import StatusColor from '@/components/orders/status-color';
import Badge from '@/components/ui/badge';
import { SpinnerLoader } from '@/components/ui/loaders/spinner/spinner';
import Button from '@/components/ui/button';
import { Order, OrderStatus } from '@/types';
import PaymentStatusColor from '@/components/orders/payment-status-color';

interface OrderViewHeaderProps {
  order: Order;
  wrapperClassName?: string;
  loading?: boolean;
}

export default function OrderViewHeader({
  order,
  wrapperClassName = 'lg:px-11 lg:py-5 p-6',
  loading = false,
}: OrderViewHeaderProps) {
  const { t } = useTranslation('common');
  const isPaymentActionPending = order.status === OrderStatus.WAITING_PAYMENT;

  return (
    <div className={cn(`bg-[#F7F8FA] ${wrapperClassName}`)}>
      <div className="mb-0 flex flex-col flex-wrap items-center justify-between gap-x-8 text-base font-bold text-heading sm:flex-row lg:flex-nowrap">
        <div
          className={`order-2 flex w-full gap-6 xs:flex-nowrap sm:order-1 ${
            !isPaymentActionPending
              ? 'max-w-full basis-full justify-between'
              : 'max-w-full basis-full justify-between lg:ltr:mr-auto'
          }`}
        >
          <div className="flex flex-wrap items-center">
            <span className="mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
              {t('text-order-status')} :
            </span>
            <div className="w-full lg:w-auto">
              {loading ? (
                <SpinnerLoader />
              ) : (
                <Badge
                  text={t(order.status)}
                  color={StatusColor(order.status)}
                  className="min-h-[2rem] items-center justify-center text-[9px] !leading-none xs:text-sm"
                />
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center">
            <span className="mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
              {t('text-payment-status')} :
            </span>
            <div className="w-full lg:w-auto">
              {loading ? (
                <SpinnerLoader />
              ) : (
                <Badge
                  text={t(order.invoice.status)}
                  color={PaymentStatusColor(order.invoice.status)}
                  className="min-h-[2rem] items-center justify-center text-[9px] !leading-none xs:text-sm"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
