import usePrice from '@/lib/use-price';
import dayjs from 'dayjs';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import StatusColor from './status-color';
import { Order } from '@/types';

type OrderCardProps = {
  order: Order;
  isActive: boolean;
  onClick?: (e: any) => void;
};

const OrderCard: React.FC<OrderCardProps> = ({ onClick, order, isActive }) => {
  const { t } = useTranslation('common');
  const { id, number, status, date, invoice } = order;
  const { price: total } = usePrice({
    amount: invoice.grand_total,
  });

  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        'mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 border-transparent bg-gray-100 last:mb-0',
        isActive && '!border-accent'
      )}
    >
      <div className="flex items-center justify-between border-b border-border-200 py-3 px-5 md:px-3 lg:px-5 ">
        <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
          {t('text-order')}
          <span className="font-normal">#{number}</span>
        </span>
      </div>

      <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
        <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
          <span className="w-24 shrink-0 overflow-hidden">
            {t('text-order-date')}
          </span>
          <span className="ltr:mr-auto rtl:ml-auto">:</span>
          <span className="ltr:ml-1 rtl:mr-1">
            {dayjs(date).format('MMMM D, YYYY')}
          </span>
        </p>
        <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
          <span className="w-24 shrink-0 overflow-hidden">
            {t('text-deliver-method')}
          </span>
          <span className="ltr:mr-auto rtl:ml-auto">:</span>
          <span className="truncate ltr:ml-1 rtl:mr-1">
            {invoice.courier_code}
          </span>
        </p>
        <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
          <span className="w-24 flex-shrink-0 overflow-hidden">
            {t('text-total-price')}
          </span>
          <span className="ltr:mr-auto rtl:ml-auto">:</span>
          <span className="ltr:ml-1 rtl:mr-1">{total}</span>
        </p>
        <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
          <span className="w-24 flex-shrink-0 overflow-hidden">
            {t('Status')}
          </span>
          <span className="ltr:mr-auto rtl:ml-auto">:</span>
          <span className="ltr:ml-1 rtl:mr-1">
            <span
              className={`max-w-full truncate whitespace-nowrap rounded ${StatusColor(
                status
              )} px-3 py-2 text-sm text-white`}
              title={t(status)}
            >
              {t(status)}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
