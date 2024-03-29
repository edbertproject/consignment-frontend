import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSettings } from '@/framework/settings';

export function formatPrice(amount: number) {
  const formatCurrency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return formatCurrency.format(amount);
}

export function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
  locale,
}: {
  baseAmount: number;
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat(locale, { style: 'percent' });
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

  const price = formatPrice(amount);
  const basePrice = hasDiscount ? formatPrice(baseAmount) : null;

  return { price, basePrice, discount };
}

export default function usePrice(
  data?: {
    amount: number;
    baseAmount?: number;
    currencyCode?: string;
  } | null
) {
  const {
    // @ts-ignore
    settings: { currency },
  } = useSettings();
  const { amount, baseAmount, currencyCode } = {
    ...data,
    currencyCode: currency ?? 'USD',
  };
  const { locale } = useRouter();
  const value = useMemo(() => {
    if (typeof amount !== 'number' || !currencyCode) return '';
    const currentLocale = locale ? locale : 'en';
    return baseAmount
      ? formatVariantPrice({
          amount,
          baseAmount,
          currencyCode,
          locale: currentLocale,
        })
      : formatPrice(amount);
  }, [amount, baseAmount, currencyCode, locale]);

  return typeof value === 'string'
    ? { price: value, basePrice: null, discount: null }
    : value;
}
