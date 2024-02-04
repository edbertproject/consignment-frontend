import Coupon from '@/components/checkout/coupon';
import usePrice from '@/lib/use-price';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/store/quick-cart/cart.context';
import {
  calculatePaidTotal,
  calculateTotal,
  Item,
} from '@/store/quick-cart/cart.utils';
import { useAtom } from 'jotai';
import { checkoutAtom } from '@/store/checkout';
import ItemCard from '@/components/checkout/item/item-card';
import { ItemInfoRow } from '@/components/checkout/item/item-info-row';
import PaymentGrid from '@/components/checkout/payment/payment-grid';
import { PlaceOrderAction } from '@/components/checkout/place-order-action';
import {
  ADMIN_FEE,
  PLATFORM_FEE_PERCENTAGE,
  TAX_PERCENTAGE,
} from '@/lib/constants';
import { useCheckAuctionProduct } from '@/framework/checkout';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Product } from '@/types';

interface Props {
  className?: string;
}
const VerifiedItemList: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation('common');
  const [productAuction, setProductAuction] = useState<Product>();
  const { items, isEmpty: isEmptyCart } = useCart();
  const router = useRouter();
  const { checkOrder, isLoading: isLoadingCheckOrder } =
    useCheckAuctionProduct();
  const [summaryCheckout] = useAtom(checkoutAtom);

  useEffect(() => {
    const { product_auction_id } = router.query;

    if (product_auction_id) {
      checkOrder(parseInt(product_auction_id as string)).then((data) =>
        setProductAuction(data.data)
      );
    }
  }, [router.query]);

  const products = useMemo<Item[]>(() => {
    if (productAuction) {
      return [
        {
          ...productAuction,
          id: productAuction?.id,
          price: productAuction?.current_bid,
          quantity: productAuction?.available_quantity,
          photo: productAuction?.photo,
          stock: productAuction?.available_quantity,
        } as Item,
      ];
    }

    if (!isEmptyCart) return items;

    return [];
  }, [productAuction, items, isEmptyCart]);

  const shipping_amount = summaryCheckout.shipping?.cost ?? 0;
  const { price: shipping } = usePrice({
    amount: shipping_amount,
  });
  const base_amount = calculateTotal(products);
  const { price: sub_total } = usePrice({
    amount: base_amount,
  });

  const tax_amount = (base_amount * TAX_PERCENTAGE) / 100;
  const { price: tax } = usePrice({
    amount: tax_amount,
  });

  const admin_amount = ADMIN_FEE;
  const { price: admin } = usePrice({
    amount: admin_amount,
  });

  const platform_amount = (base_amount * PLATFORM_FEE_PERCENTAGE) / 100;
  const { price: platform } = usePrice({
    amount: platform_amount,
  });

  const { price: total } = usePrice({
    amount:
      base_amount +
      tax_amount +
      admin_amount +
      platform_amount +
      shipping_amount,
  });

  return (
    <div className={className}>
      <div className="flex flex-col border-b border-border-200 pb-2">
        {isLoadingCheckOrder ? (
          'Checking order...'
        ) : products.length > 0 ? (
          products?.map((item) => {
            return <ItemCard item={item} key={item.id} notAvailable={false} />;
          })
        ) : (
          <EmptyCartIcon />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <ItemInfoRow title={t('text-sub-total')} value={sub_total} />
        <ItemInfoRow title={t('text-tax')} value={tax} />
        <ItemInfoRow title={t('text-admin-fee')} value={admin} />
        <ItemInfoRow title={t('text-platform-fee')} value={platform} />
        <div className="flex justify-between">
          <p className="text-sm text-body">{t('text-shipping-fee')}</p>
          <span className="text-sm text-body">{shipping}</span>
        </div>
        <div className="flex justify-between border-t-4 border-double border-border-200 pt-3">
          <p className="text-base font-semibold text-heading">
            {t('text-total')}
          </p>
          <span className="text-base font-semibold text-heading">{total}</span>
        </div>
      </div>
      <PaymentGrid className="mt-10 border border-gray-200 bg-light p-5" />
      <PlaceOrderAction>{t('text-place-order')}</PlaceOrderAction>
    </div>
  );
};

export default VerifiedItemList;
