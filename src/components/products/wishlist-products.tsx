import ErrorMessage from '@/components/ui/error-message';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';
import Button from '@/components/ui/button';
import { productPlaceholder } from '@/lib/placeholders';
import NotFound from '@/components/ui/not-found';
import Rating from '@/components/ui/rating-badge';
import usePrice from '@/lib/use-price';
import { useRemoveFromWishlist, useWishlist } from '@/framework/wishlist';
import type { Product } from '@/types';
import { Routes } from '@/config/routes';
import { AddToCart } from './add-to-cart/add-to-cart';
import WishlistLoader from '@/components/ui/loaders/wishlist-loader';
import { useModalAction } from '@/components/ui/modal/modal.context';
import rangeMap from '@/lib/range-map';
import AddToCartBtn from './add-to-cart/add-to-cart-btn';
import { DEFAULT_LANGUAGE } from '@/lib/constants';

function WishlistItem({ product }: { product: Product }) {
  const { t } = useTranslation('common');
  const { removeFromWishlist, isLoading } = useRemoveFromWishlist();

  const { price } = usePrice({
    amount: product?.price,
  });

  const { price: startPrice } = usePrice({
    amount: product?.start_price,
  });

  return (
    <div className="flex w-full items-start space-x-4 border-b border-gray-200 py-5 first:pt-0 last:border-0 last:pb-0 rtl:space-x-reverse sm:space-x-5 xl:items-center">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded border border-gray-200 sm:h-[74px] sm:w-[74px]">
        <Image
          src={product?.photo?.original_url ?? productPlaceholder}
          alt="text"
          layout="fill"
        />
      </div>

      <div className="flex w-full flex-col items-start sm:flex-row sm:justify-between sm:space-x-4 rtl:sm:space-x-reverse xl:items-center">
        <div className="flex w-full flex-col sm:items-start">
          <Link
            href={`products/${product.slug}`}
            className="text-lg font-semibold text-heading transition-colors hover:text-accent"
          >
            {product?.name}
          </Link>

          {/* <p className="mt-3 space-y-2 space-x-3.5 sm:space-y-0 rtl:sm:space-x-reverse"> */}
          {/*<p className="mt-1.5 flex flex-col items-start space-y-3">*/}
          {/*  <Link*/}
          {/*    href={Routes.shop(product?.shop?.slug)}*/}
          {/*    className="inline-block w-auto text-sm font-semibold text-body-dark transition-colors hover:text-accent"*/}
          {/*  >*/}
          {/*    {product?.shop?.name}*/}
          {/*  </Link>*/}
          {/*</p>*/}
        </div>

        <div className="mt-4 flex w-full flex-col justify-between space-y-3 xs:flex-row xs:space-y-0 sm:w-auto sm:flex-col sm:justify-end sm:space-y-3 md:mt-0">
          {product?.type === 'Consign' ? (
            <span className="flex min-w-150 items-center sm:justify-end">
              <ins className="text-xl font-semibold text-heading no-underline">
                {price}
              </ins>
            </span>
          ) : (
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <span className="text-xl font-semibold text-heading">
                Start from {startPrice}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-6 rtl:space-x-reverse sm:justify-end">
            {Number(product?.available_quantity) > 0 && (
              <AddToCart variant="text" data={product} />
            )}

            {Number(product?.available_quantity) <= 0 && (
              <span className="whitespace-nowrap text-sm font-semibold text-red-300 sm:mt-0">
                {t('text-out-stock')}
              </span>
            )}
            <span className="flex h-7 w-px border-r border-dashed border-gray-300" />
            <button
              className="whitespace-nowrap text-sm font-semibold text-red-500 hover:underline sm:mt-0"
              onClick={() => removeFromWishlist(product?.id)}
              disabled={isLoading}
            >
              {t('text-remove')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const WishlistProducts: React.FC = () => {
  const { t } = useTranslation('common');
  const { wishlists, isLoading, isLoadingMore, error, hasMore, loadMore } =
    useWishlist();

  if (error) return <ErrorMessage message={error.message} />;

  // loader
  if (!wishlists.length && isLoading) {
    return (
      <div className="flex w-full flex-col">
        <div className="mb-8 flex items-center justify-center sm:mb-10">
          <h1 className="text-center text-lg font-semibold text-heading sm:text-xl">
            {t('profile-sidebar-my-wishlist')}
          </h1>
        </div>
        {rangeMap(15, (i) => (
          <WishlistLoader key={i} uniqueKey={`favorite-${i}`} />
        ))}
      </div>
    );
  }

  if (!wishlists.length && !isLoading) {
    return (
      <div className="flex w-full flex-col">
        <div className="mb-8 flex items-center justify-center sm:mb-10">
          <h1 className="text-center text-lg font-semibold text-heading sm:text-xl">
            {t('profile-sidebar-my-wishlist')}
          </h1>
        </div>
        <NotFound
          text="text-no-wishlist"
          className="mx-auto w-full md:w-7/12"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="mb-8 flex items-center justify-center sm:mb-10">
          <h1 className="text-center text-lg font-semibold text-heading sm:text-xl">
            {t('profile-sidebar-my-wishlist')}
          </h1>
        </div>
        {wishlists?.map((item, index) => (
          <WishlistItem key={index} product={item.product} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex w-full justify-center">
          <Button
            loading={isLoadingMore}
            disabled={isLoadingMore}
            onClick={loadMore}
          >
            {t('text-load-more')}
          </Button>
        </div>
      )}
    </>
  );
};

export default WishlistProducts;
