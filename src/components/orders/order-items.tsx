import { Table } from '@/components/ui/table';
import usePrice from '@/lib/use-price';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/lib/locals';
import { Image } from '@/components/ui/image';
import { productPlaceholder } from '@/lib/placeholders';
import { useModalAction } from '@/components/ui/modal/modal.context';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { getReview } from '@/lib/get-review';
import { Order, Product } from '@/types';

//FIXME: need to fix this usePrice hooks issue within the table render we may check with nested property
const OrderItemList = (_: any, record: Product) => {
  const { price } = usePrice({
    amount: record.price,
  });
  let name = record.name;
  return (
    <div className="flex items-center">
      <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded">
        <Image
          src={record.photo?.original_url ?? productPlaceholder}
          alt={name}
          className="h-full w-full object-cover"
          layout="fill"
        />
      </div>

      <div className="flex flex-col overflow-hidden ltr:ml-4 rtl:mr-4">
        <div className="mb-1 flex space-x-1 rtl:space-x-reverse">
          <Link
            href={Routes.product(record?.slug)}
            className="inline-block overflow-hidden truncate text-sm text-body transition-colors hover:text-accent hover:underline"
          >
            {name}
          </Link>
        </div>
        <span className="mb-1 inline-block overflow-hidden truncate text-sm font-semibold text-accent">
          {price}
        </span>
      </div>
    </div>
  );
};
export const OrderItems = ({ order }: { order: Order; orderId: string }) => {
  const { t } = useTranslation('common');
  const { alignLeft, alignRight } = useIsRTL();

  const orderTableColumns = [
    {
      title: <span className="ltr:pl-20 rtl:pr-20">{t('text-item')}</span>,
      dataIndex: '',
      key: 'name',
      align: alignLeft,
      ellipsis: true,
      render: OrderItemList,
    },
    {
      title: t('text-quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (value: number) => {
        return <p className="text-base">{value} pcs</p>;
      },
    },
    {
      title: t('text-price'),
      dataIndex: 'price',
      key: 'price',
      align: alignRight,
      render: (price: number) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { price: formatted } = usePrice({
          amount: price,
        });
        return <p>{formatted}</p>;
      },
    },
  ];

  return (
    <Table
      //@ts-ignore
      columns={orderTableColumns}
      data={[order.product]}
      rowKey={(record: Product) => record.id}
      className="orderDetailsTable w-full"
      rowClassName="!cursor-auto"
      scroll={{ x: 350, y: 500 }}
    />
  );
};
