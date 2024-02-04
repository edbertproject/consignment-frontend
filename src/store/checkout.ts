import { Address, Coupon, Shipping } from '@/types';
import { CHECKOUT } from '@/lib/constants';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface VerifiedResponse {
  total_tax: number;
  shipping_charge: number;
  unavailable_products: any[];
  wallet_amount: number;
  wallet_currency: number;
}

interface CheckoutState {
  address: Address | null;
  payment_method_id: number | null;
  shipping: Shipping | null;

  [key: string]: unknown;
}

export const defaultCheckout: CheckoutState = {
  address: null,
  payment_method_id: null,
  shipping: null,
};

// Original atom.
export const checkoutAtom = atomWithStorage(CHECKOUT, defaultCheckout);
export const clearCheckoutAtom = atom(null, (_get, set, _data) => {
  return set(checkoutAtom, defaultCheckout);
});
export const addressAtom = atom(
  (get) => get(checkoutAtom).address,
  (get, set, data: Address) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, address: data, shipping: null });
  }
);
export const billingAddressAtom = atom(
  (get) => get(checkoutAtom).billing_address,
  (get, set, data: Address) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, billing_address: data });
  }
);
export const shippingAddressAtom = atom(
  (get) => get(checkoutAtom).shipping_address,
  (get, set, data: Address) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, shipping_address: data });
  }
);
export const deliveryShippingAtom = atom(
  (get) => get(checkoutAtom).shipping,
  (get, set, data: Shipping) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, shipping: data });
  }
);
export const paymentMethodAtom = atom(
  (get) => get(checkoutAtom).payment_method_id,
  (get, set, data: number) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, payment_method_id: data });
  }
);
export const customerContactAtom = atom(
  (get) => get(checkoutAtom).customer_contact,
  (get, set, data: string) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, customer_contact: data });
  }
);
export const guestNameAtom = atom(
  (get) => get(checkoutAtom).customer_name,
  (get, set, data: string) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, customer_name: data });
  }
);
export const verifiedResponseAtom = atom(
  (get) => get(checkoutAtom).verified_response,
  (get, set, data: VerifiedResponse | null) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, verified_response: data });
  }
);
export const couponAtom = atom(
  (get) => get(checkoutAtom).coupon,
  (get, set, data: Coupon | null) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, coupon: data });
  }
);

export const walletAtom = atom(
  (get) => get(checkoutAtom).use_wallet,
  (get, set) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, use_wallet: !prev.use_wallet });
  }
);
export const payableAmountAtom = atom(
  (get) => get(checkoutAtom).payable_amount,
  (get, set, data: number) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, payable_amount: data });
  }
);
