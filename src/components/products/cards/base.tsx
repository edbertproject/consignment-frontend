import Link from '@/components/ui/link';
import { Image } from '@/components/ui/image';
import cn from 'classnames';
import usePrice from '@/lib/use-price';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { productPlaceholder } from '@/lib/placeholders';
import { TimeIcon } from '@/components/icons/time-icon';
import React from 'react';
import { Product } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

type BaseProps = {
  product: Product;
  className?: string;
};

const Base: React.FC<BaseProps> = ({ product, className }) => {
  const { t } = useTranslation('common');
  const { photo, slug } = product ?? {};
  const { price } = usePrice({
    amount: product.price!,
    baseAmount: product.price,
  });

  const { price: startPrice } = usePrice({
    amount: product.start_price!,
    baseAmount: product.start_price,
  });

  const getDate = (): string => {
    dayjs.extend(relativeTime);
    if (dayjs(product.start_date).isAfter(dayjs())) {
      return 'Start ' + dayjs(product.start_date).fromNow(false);
    }

    return 'End ' + dayjs(product.end_date).fromNow(false);
  };

  return (
    <div className={'group relative flex flex-col !border-0 ' + className}>
      <div className="relative flex-shrink-0 ">
        <div>
          <div className="aspect-w-11 aspect-h-12 z-0 flex w-full overflow-hidden rounded-xl">
            <Image
              src={photo?.original_url ?? productPlaceholder}
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-[1.03]"
              alt="nc-imgs"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </div>
      <div className="space-y-3 p-4 py-3">
        <h2 className="text-lg font-medium">{product.name}</h2>
        <div className="flex justify-between">
          <span className="rounded-xl border border-gray-500 px-4 text-xs text-gray-500">
            {product.type}
          </span>
          {product.status === 'Sold' && (
            <span className="rounded-xl border border-red-500 px-4 text-xs text-red-500">
              {product.status}
            </span>
          )}
        </div>
        <div className="w-2d4 w-full border-b border-neutral-100"></div>
        <div className="flex items-end justify-between ">
          <div className="pt-2">
            <div className="relative flex items-baseline rounded-xl border-2 border-green-500 py-1.5 px-2.5 text-sm font-semibold sm:text-base md:py-2 md:px-3.5 ">
              <span className="absolute bottom-full -mx-1 block translate-y-1 bg-white p-1 text-xs font-normal text-neutral-500">
                {product.type === 'Consign' ? 'Price' : 'Start Price'}
              </span>
              <span className=" !leading-none text-green-500">
                {product.type === 'Consign' ? price : startPrice}
              </span>
            </div>
          </div>
          <div className="flex items-center text-sm text-neutral-500">
            {product.type === 'Auction' && (
              <>
                <TimeIcon />
                <span className="ml-1 mt-0.5">{getDate()}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <Link className="absolute inset-0" href={Routes.product(slug)}></Link>
    </div>
  );
};

export default Base;
