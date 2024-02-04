import { useTranslation } from 'next-i18next';
import ReviewCard from '@/components/reviews/review-card';
import Pagination from '@/components/ui/pagination';
import { useEffect, useState } from 'react';
import Sorting from './sorting';
import StarFilter from './star-filter';
import { useRouter } from 'next/router';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { useBids } from '@/framework/product';
import BidCard from '@/components/reviews/bid-card';
import Pusher from 'pusher-js';
import { Bid } from '@/types';

type ProductBidsProps = {
  className?: any;
  productId: number;
};

const ProductBids: React.FC<ProductBidsProps> = ({ productId }) => {
  const { query } = useRouter();
  const { text, ...restQuery } = query;
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const { bids, isLoading, paginatorInfo, refetch } = useBids({
    product_id: productId,
    per_page: 5,
    page,
    ...(!isEmpty(restQuery) && { ...restQuery }),
  });

  function onPagination(current: number) {
    setPage(current);
  }

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher('bbb40b8282ab2cc8d7ef', {
      cluster: 'ap1',
    });

    // Subscribe to a Pusher channel
    const channel = pusher.subscribe(`product.bid.${productId}`);

    // Bind to a Pusher event
    channel.bind('new.bid', (data: Bid) => {
      refetch();
    });

    // Return a cleanup function to disconnect from Pusher when the component unmounts
    return () => {
      pusher.disconnect();
    };
  }, []);

  if (isLoading && isEmpty(bids)) {
    return <Spinner />;
  }

  return (
    <div>
      <div
        className={cn(
          'border-t border-b border-border-200 border-opacity-70 px-5 ltr:lg:pl-16 ltr:lg:pr-10 rtl:lg:pr-16 rtl:lg:pl-10'
        )}
      >
        <div
          className={cn(
            'flex flex-col justify-between sm:flex-row sm:items-center'
          )}
        >
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-heading sm:mt-0">
            {t('text-product-bids')} ({paginatorInfo?.total ?? 0})
          </h2>
          <div className="flex flex-col items-center border-border-200 border-opacity-70 py-3 sm:space-y-1 ltr:sm:border-l rtl:sm:border-r lg:flex-row lg:space-y-0 lg:!border-0 lg:py-0">
            <div className="w-full shrink-0 border-border-200 border-opacity-70 ltr:sm:pl-8 ltr:sm:pr-5 rtl:sm:pl-5 rtl:sm:pr-8 lg:w-auto lg:py-5 ltr:lg:border-l rtl:lg:border-r">
              <Sorting />
            </div>
          </div>
        </div>
      </div>
      {!isEmpty(bids) ? (
        <div
          className={cn(
            'border-b border-border-200 border-opacity-70 px-5 lg:px-16'
          )}
        >
          <div className={cn('mx-auto max-w-screen-xl')}>
            {bids?.map((bid: any) => (
              <BidCard key={`bid-no-${bid?.id}`} bid={bid} />
            ))}

            {/* Pagination */}
            {paginatorInfo && (
              <div className="flex items-center justify-between border-t border-border-200 border-opacity-70 py-4">
                <div className="text-xs text-gray-400">
                  {t('text-page')} {paginatorInfo.meta.current_page}{' '}
                  {t('text-of')}{' '}
                  {Math.ceil(
                    paginatorInfo.meta.total / paginatorInfo.meta.per_page
                  )}
                </div>

                <div className="mb-2 flex items-center">
                  <Pagination
                    total={paginatorInfo.total}
                    current={paginatorInfo.meta.current_page}
                    pageSize={paginatorInfo.meta.per_page}
                    onChange={onPagination}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-b border-border-200 border-opacity-70 px-5 py-16">
          <h3 className="text-lg font-semibold text-gray-400">
            {t('text-no-bids-found')}
          </h3>
        </div>
      )}
    </div>
  );
};

export default ProductBids;
