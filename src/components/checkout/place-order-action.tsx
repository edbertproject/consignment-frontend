import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { useCreateOrder } from '@/framework/order';
import ValidationError from '@/components/ui/validation-error';
import Button from '@/components/ui/button';
import { useCart } from '@/store/quick-cart/cart.context';
import { checkoutAtom } from '@/store/checkout';
import { useTranslation } from 'next-i18next';
import { CreateOrderInput } from '@/types';
import { useRouter } from 'next/router';

export const PlaceOrderAction: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createOrder, isLoading } = useCreateOrder();
  const { items } = useCart();
  const router = useRouter();

  const [{ address, payment_method_id, shipping }] = useAtom(checkoutAtom);

  const handlePlaceOrder = () => {
    const { product_auction_id } = router.query;

    let input: CreateOrderInput = {
      product_auction_id: product_auction_id
        ? parseInt(product_auction_id as string)
        : undefined,
      cart_ids: items.length > 0 ? items.map((e) => e.cart_id ?? 0) : undefined,
      payment_method_id: payment_method_id ?? 0,
      user_address_id: address?.id ?? 0,
      courier_code: shipping?.code ?? '',
      courier_service: shipping?.service ?? '',
      courier_cost: shipping?.cost ?? 0,
      courier_esd: shipping?.estimation_day ?? '',
    };
    createOrder(input);
  };

  const isAllRequiredFieldSelected = address && payment_method_id && shipping;
  return (
    <>
      <Button
        loading={isLoading}
        className={classNames('mt-5 w-full', props.className)}
        onClick={handlePlaceOrder}
        disabled={!isAllRequiredFieldSelected}
        {...props}
      />
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
      {!isAllRequiredFieldSelected && (
        <div className="mt-3">
          <ValidationError message={t('text-place-order-helper-text')} />
        </div>
      )}
    </>
  );
};
