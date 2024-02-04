import usePrice from '@/lib/use-price';
import { formatAddress } from '@/lib/format-address';
import { useTranslation } from 'next-i18next';
import { OrderItems } from './order-items';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { SadFaceIcon } from '@/components/icons/sad-face';
import Badge from '@/components/ui/badge';
import type { Order } from '@/types';
import OrderViewHeader from './order-view-header';
import OrderStatusProgressBox from '@/components/orders/order-status-progress-box';
import { OrderStatus, OrderStatusBuyer } from '@/types';
import Button from '@/components/ui/button';
import OrderViewHeaderPayment from '@/components/orders/order-view-header-payment';
import { useUpdateStatusBuyer } from '@/framework/order';
import classNames from 'classnames';

interface Props {
  order: Order;
  loadingStatus?: boolean;
}

const RenderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { t } = useTranslation('common');

  switch (status.toLowerCase()) {
    case 'approved':
      return (
        <Badge
          text={`${t('text-refund')} ${t('text-approved')}`}
          color="bg-accent"
          className="ltr:mr-4 rtl:ml-4"
        />
      );

    case 'rejected':
      return (
        <Badge
          text={`${t('text-refund')} ${t('text-rejected')}`}
          color="bg-red-500"
          className="ltr:mr-4 rtl:ml-4"
        />
      );
    case 'processing':
      return (
        <Badge
          text={`${t('text-refund')} ${t('text-processing')}`}
          color="bg-yellow-500"
          className="ltr:mr-4 rtl:ml-4"
        />
      );
    // case 'pending':
    default:
      return (
        <Badge
          text={`${t('text-refund')} ${t('text-pending')}`}
          color="bg-purple-500"
          className="ltr:mr-4 rtl:ml-4"
        />
      );
  }
};

function RefundView({
  status,
  orderId,
}: {
  status: string;
  orderId: string | number;
}) {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();

  return (
    <>
      {status ? (
        <RenderStatusBadge status={status} />
      ) : (
        <button
          className="flex items-center text-sm font-semibold text-body transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-gray-400 ltr:mr-4 rtl:ml-4"
          onClick={() => openModal('REFUND_REQUEST', orderId)}
          disabled={Boolean(status)}
        >
          <SadFaceIcon width={18} className="ltr:mr-2 rtl:ml-2" />
          {t('text-ask-refund')}
        </button>
      )}
    </>
  );
}

const OrderDetails = ({ order, loadingStatus }: Props) => {
  const { t } = useTranslation('common');

  const { mutate: mutateStatusBuyer, isLoading } = useUpdateStatusBuyer();
  const { openModal } = useModalAction();
  const {
    user_address,
    number,
    id,
    invoice,
    next_status_buyer,
    can_process_next_status_buyer,
  } = order ?? {};

  const { price: amount } = usePrice({
    amount: invoice.subtotal,
  });
  const { price: total } = usePrice({
    amount: invoice.grand_total,
  });
  const { price: delivery_fee } = usePrice({
    amount: invoice.courier_cost ?? 0,
  });
  const { price: platform_fee } = usePrice({
    amount: invoice.platform_fee ?? 0,
  });
  const { price: admin_fee } = usePrice({
    amount: invoice.admin_fee ?? 0,
  });
  const { price: sales_tax } = usePrice({
    amount: invoice.tax_amount,
  });

  const updateStatusBuyer = (status: OrderStatusBuyer) => {
    mutateStatusBuyer({
      status: status,
      id: id,
    });
  };

  const handleHowToPayModal = () => {
    openModal(
      'HOW_TO_PAY',
      order.invoice?.payment_method?.payment_method_instructions
    );
  };

  const isPaymentActionPending = order.status === OrderStatus.WAITING_PAYMENT;

  return (
    <div className="flex w-full flex-col border border-border-200 bg-white lg:w-2/3">
      <div className="flex flex-col items-center p-5 md:flex-row md:justify-between">
        <h2 className="mb-2 flex text-sm font-semibold text-heading md:text-lg">
          {t('text-order-details')} <span className="px-2">-</span> {number}
        </h2>
        {/*<div className="flex items-center">*/}
        {/*  <Link*/}
        {/*    href={Routes.order(id)}*/}
        {/*    className="flex items-center text-sm font-semibold text-accent no-underline transition duration-200 hover:text-accent-hover focus:text-accent-hover"*/}
        {/*  >*/}
        {/*    <Eye width={20} className="ltr:mr-2 rtl:ml-2" />*/}
        {/*    {t('text-sub-orders')}*/}
        {/*  </Link>*/}
        {/*</div>*/}
        {isPaymentActionPending && (
          <div className="flex items-center">
            <Button
              onClick={handleHowToPayModal}
              className="w-full"
              size="small"
            >
              {t('text-how-to-pay')}
            </Button>
          </div>
        )}
      </div>
      <div className="relative mx-5 mb-6 overflow-hidden rounded">
        <OrderViewHeader
          order={order}
          wrapperClassName="px-7 py-4"
          loading={loadingStatus}
        />
      </div>

      {isPaymentActionPending && (
        <div className="relative mx-5 mb-6 overflow-hidden rounded">
          <OrderViewHeaderPayment
            order={order}
            wrapperClassName="px-7 py-4"
            loading={loadingStatus}
          />
        </div>
      )}

      <div className="flex flex-col border-b border-border-200 sm:flex-row">
        <div className="flex w-full flex-col border-b border-border-200 px-5 py-4 sm:border-b-0 ltr:sm:border-r rtl:sm:border-l md:w-3/5">
          <div className="mb-4">
            <span className="mb-2 block text-sm font-bold text-heading">
              {t('text-address')}
            </span>

            <span className="text-sm text-body">
              {formatAddress(user_address)}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col px-5 py-4 md:w-2/5">
          <div className="mb-3 flex justify-between">
            <span className="text-sm text-body">{t('text-sub-total')}</span>
            <span className="text-sm text-heading">{amount}</span>
          </div>

          <div className="mb-3 flex justify-between">
            <span className="text-sm text-body">{t('text-delivery-fee')}</span>
            <span className="text-sm text-heading">{delivery_fee}</span>
          </div>

          <div className="mb-3 flex justify-between">
            <span className="text-sm text-body">{t('text-platform-fee')}</span>
            <span className="text-sm text-heading">{platform_fee}</span>
          </div>

          <div className="mb-3 flex justify-between">
            <span className="text-sm text-body">{t('text-admin-fee')}</span>
            <span className="text-sm text-heading">{admin_fee}</span>
          </div>

          <div className="mb-3 flex justify-between">
            <span className="text-sm text-body">{t('text-tax')}</span>
            <span className="text-sm text-heading">{sales_tax}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm font-bold text-heading">
              {t('text-total')}
            </span>
            <span className="text-sm font-bold text-heading">{total}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex w-full items-center justify-center px-6">
          <OrderStatusProgressBox
            lastStatus={order.status_buyer as OrderStatusBuyer}
            orderStatuses={order.buyer_statuses}
          />
        </div>
        <OrderItems order={order} orderId={id} />
      </div>

      {can_process_next_status_buyer && (
        <div className="align-center mx-4 my-10 flex justify-end">
          {next_status_buyer?.map((next_status, index) => {
            return (
              <Button
                key={index}
                className={classNames(
                  {
                    'border-red-500 bg-red-500':
                      next_status === OrderStatusBuyer.COMPLAIN,
                  },
                  'ml-4'
                )}
                loading={isLoading}
                onClick={() =>
                  updateStatusBuyer(next_status as OrderStatusBuyer)
                }
                size="small"
              >
                {`Proceed to ${next_status}`}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
