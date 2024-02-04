import ErrorMessage from '@/components/ui/error-message';
import {
  useGenerateDownloadableUrl,
  useAuctionProducts,
} from '@/framework/order';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import Button from '@/components/ui/button';
import { productPlaceholder } from '@/lib/placeholders';
import { isEmpty } from 'lodash';
import NotFound from '@/components/ui/not-found';
import WishlistLoader from '@/components/ui/loaders/wishlist-loader';
import rangeMap from '@/lib/range-map';
import { SpinnerLoader } from '@/components/ui/loaders/spinner/spinner';
import { formatPrice } from '@/lib/use-price';
import { useCheckAuctionProduct } from '@/framework/checkout';
import { useRouter } from 'next/router';

const AuctionProducts: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    auctions,
    error,
    loadMore,
    isLoading,
    isFetching,
    isLoadingMore,
    hasMore,
  } = useAuctionProducts({
    limit: 10,
  });

  const { checkOrder, isLoading: isLoadingCheckAuction } =
    useCheckAuctionProduct();

  const handleCheckout = (id: number) => {
    checkOrder(id).then(() => {
      router
        .push({
          pathname: `${Routes.checkout}`,
          query: {
            product_auction_id: id,
          },
        })
        .catch();
    });
  };

  const isLoadingStatus = !isLoadingMore && !isLoading && isFetching;

  if (error) return <ErrorMessage message={error.message} />;

  if (isLoading && !auctions.length)
    return (
      <>
        {rangeMap(4, (i) => (
          <WishlistLoader key={i} uniqueKey={`favorite-${i}`} />
        ))}
      </>
    );

  if (!isLoading && !auctions.length)
    return (
      <NotFound text="text-no-download" className="mx-auto w-full md:w-7/12" />
    );

  return (
    <>
      {isLoadingStatus ? (
        <div className="absolute top-0 left-0 z-10 flex h-full w-full bg-black/10">
          <SpinnerLoader className="m-auto !h-8 !w-8" />
        </div>
      ) : (
        ''
      )}
      {auctions?.map((item, index) => (
        <div
          key={index}
          className="flex w-full space-x-4 border-b border-gray-200 py-5 first:pt-0 last:border-0 last:pb-0 rtl:space-x-reverse sm:space-x-5"
        >
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
            <Image
              src={item.photo?.original_url ?? productPlaceholder}
              alt="text"
              layout="fill"
            />
          </div>

          <div className="flex w-full flex-col items-start sm:flex-row sm:justify-between sm:space-x-4 rtl:sm:space-x-reverse">
            <div className="flex w-full flex-col space-y-1 sm:items-start">
              <Link
                href={`${Routes.products}/${item.slug}`}
                className="text-base font-semibold text-heading transition-colors hover:text-accent"
              >
                {item.name}
              </Link>

              <p className="space-y-1 sm:space-x-1 sm:space-y-0 rtl:sm:space-x-reverse">
                <span className="block text-sm font-semibold text-body-dark sm:inline-block sm:w-auto">
                  {t('text-your-bid')}: Rp {formatPrice(item.current_bid)}
                </span>
                <span className="hidden text-sm text-body sm:inline-block">
                  |
                </span>
                <span className="block text-sm text-body sm:inline-block">
                  {t('text-last-bid-on')}:{' '}
                  {dayjs(item.current_bid_at).format('DD/MM/YYYY HH:MM')}
                </span>
              </p>

              <p className="space-y-1 sm:space-x-1 sm:space-y-0 rtl:sm:space-x-reverse">
                <span
                  className={
                    'inline-flex shrink-0 items-center rounded-full px-2 py-[3px] text-sm text-white ' +
                    (item.status === 'WINNER' ? 'bg-accent' : 'bg-red-500')
                  }
                >
                  {item.status}
                </span>
              </p>
            </div>
            {item.can_pay === 1 && (
              <span className="order-2 mt-5 w-full max-w-full shrink-0 basis-full sm:order-1 lg:mt-0 lg:w-auto lg:max-w-none lg:basis-auto lg:ltr:ml-auto lg:rtl:mr-auto">
                <Button
                  onClick={() => handleCheckout(item.id)}
                  className="w-full"
                  size="small"
                  loading={isLoadingCheckAuction}
                >
                  {t('text-checkout-now')}
                </Button>
              </span>
            )}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="mt-8 flex w-full justify-center">
          <Button loading={isLoading} onClick={loadMore}>
            {t('text-load-more')}
          </Button>
        </div>
      )}
    </>
  );
};

export default AuctionProducts;
