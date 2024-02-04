import BackButton from '@/components/ui/back-button';
import { AddToCart } from '@/components/products/add-to-cart/add-to-cart';
import usePrice, { formatPrice } from '@/lib/use-price';
import { ThumbsCarousel } from '@/components/ui/thumb-carousel';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { scroller, Element } from 'react-scroll';
import CategoryBadges from './category-badges';
import VariationPrice from './variation-price';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import type { Bid, Product } from '@/types';
import { useAtom } from 'jotai';
import VariationGroups from './variation-groups';
import { isVariationSelected } from '@/lib/is-variation-selected';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { stickyShortDetailsAtom } from '@/store/sticky-short-details-atom';
import { useAttributes } from './attributes.context';
import classNames from 'classnames';
import { displayImage } from '@/lib/display-product-preview-images';
import { HeartOutlineIcon } from '@/components/icons/heart-outline';
import { HeartFillIcon } from '@/components/icons/heart-fill';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { useUser } from '@/framework/user';
import {
  useInWishlist,
  useRemoveFromWishlist,
  useToggleWishlist,
} from '@/framework/wishlist';
import { useIntersection } from 'react-use';
import { StarIcon } from '@/components/icons/star-icon';
import { TimeIcon } from '@/components/icons/time-icon';
import { WalletBid } from '@/components/icons/category/wallet-bid';
import { PencilBid } from '@/components/icons/category/pencil-bid';
import useCountdown from '@/lib/use-countdown';
import dayjs from 'dayjs';
import { useBid } from '@/framework/product';
import Button from '@/components/ui/button';
import Pusher from 'pusher-js';
import { useQueryClient } from 'react-query';

function FavoriteButton({
  productId,
  className,
}: {
  productId: number;
  className?: string;
}) {
  const { isAuthorized } = useUser();
  const { toggleWishlist, isLoading: adding } = useToggleWishlist(productId);
  const { removeFromWishlist, isLoading: removing } = useRemoveFromWishlist();
  const { inWishlist, isLoading: checking } = useInWishlist({
    enabled: isAuthorized,
    product_id: productId,
  });

  const { openModal } = useModalAction();
  function toggle() {
    if (!isAuthorized) {
      openModal('LOGIN_VIEW');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(productId);
    } else {
      toggleWishlist({ product_id: productId });
    }
  }

  const isLoading = adding || checking || removing;
  if (isLoading) {
    return (
      <div
        className={classNames(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300',
          className
        )}
      >
        <Spinner simple={true} className="flex h-5 w-5" />
      </div>
    );
  }
  return (
    <button
      type="button"
      className={classNames(
        'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-colors',
        {
          '!border-accent': inWishlist,
        },
        className
      )}
      onClick={toggle}
    >
      {inWishlist ? (
        <HeartFillIcon className="h-5 w-5 text-accent" />
      ) : (
        <HeartOutlineIcon className="h-5 w-5 text-accent" />
      )}
    </button>
  );
}
type Props = {
  product: Product;
  backBtn?: boolean;
  isModal?: boolean;
};
const Details: React.FC<Props> = ({
  product,
  backBtn = true,
  isModal = false,
}) => {
  const {
    id,
    name,
    photos,
    description,
    quantity,
    current_bid,
    multiplied_price,
    start_date,
    end_date,
    slug,
    partner_id,
    status,
  } = product ?? {};

  const { me } = useUser();
  const notStarted = dayjs().isBefore(dayjs(start_date));

  const ownProduct = me?.partner?.id === partner_id;
  const active = status === 'Active';

  const [currentBid, setCurrentBid] = useState<number>(current_bid);

  const { t } = useTranslation('common');
  const [_, setShowStickyShortDetails] = useAtom(stickyShortDetailsAtom);
  const { isAuthorized } = useUser();
  const { openModal } = useModalAction();
  const { bidProduct, isLoading: bidLoading } = useBid(id);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { closeModal } = useModalAction();
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  });
  useEffect(() => {
    if (intersection && intersection.isIntersecting) {
      setShowStickyShortDetails(false);
      return;
    }
    if (intersection && !intersection.isIntersecting) {
      setShowStickyShortDetails(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersection]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher('bbb40b8282ab2cc8d7ef', {
      cluster: 'ap1',
    });

    // Subscribe to a Pusher channel
    const channel = pusher.subscribe(`product.bid.${id}`);

    // Bind to a Pusher event
    channel.bind('new.bid', (data: Bid) => {
      setCurrentBid(data.amount);
    });

    // Return a cleanup function to disconnect from Pusher when the component unmounts
    return () => {
      pusher.disconnect();
    };
  }, []);

  function bid(amount: number) {
    if (!isAuthorized) {
      openModal('LOGIN_VIEW');
      return;
    }
    bidProduct({ product_id: id, amount: amount });
  }

  function customBid() {
    if (!isAuthorized) {
      openModal('LOGIN_VIEW');
      return;
    }

    openModal('PRODUCT_BID', { id, currentBid, multiplied: multiplied_price });
  }

  const { price, basePrice, discount } = usePrice({
    amount: product?.price ?? currentBid,
    baseAmount: product?.price ?? currentBid,
  });

  const { day, hour, minute, second } = useCountdown(
    notStarted ? start_date : end_date
  );

  const navigate = (path: string) => {
    router.push(path);
    closeModal();
  };

  return (
    <article className="rounded-lg bg-light">
      <div className="flex flex-col border-b border-border-200 border-opacity-70 md:flex-row">
        <div className="p-6 pt-10 md:w-1/2 lg:p-14 xl:p-16">
          <div className="mb-8 flex items-center justify-between lg:mb-10">
            {backBtn && <BackButton />}
            {discount && (
              <div className="rounded-full bg-yellow-500 px-3 text-xs font-semibold leading-6 text-light ltr:ml-auto rtl:mr-auto">
                {discount}
              </div>
            )}
          </div>

          <div className="product-gallery h-full">
            <ThumbsCarousel
              gallery={photos ?? []}
              hideThumbs={(photos?.length ?? 0) <= 1}
            />
          </div>
        </div>

        <div className="flex flex-col items-start p-5 pt-10 md:w-1/2 lg:p-14 xl:p-16">
          <div className="w-full" ref={intersectionRef}>
            <div className="flex w-full items-start justify-between space-x-8 rtl:space-x-reverse">
              <h1
                className={classNames(
                  `text-lg font-bold tracking-tight text-heading md:text-xl xl:text-3xl`,
                  {
                    'cursor-pointer transition-colors hover:text-accent':
                      isModal,
                  }
                )}
                {...(isModal && {
                  onClick: () => navigate(Routes.product(slug)),
                })}
              >
                {name}
              </h1>

              <span>
                <FavoriteButton
                  productId={id}
                  className={classNames({ 'mr-1': isModal })}
                />
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              {/*{isModal && (*/}
              {/*  <div className="inline-flex shrink-0 items-center rounded border border-accent bg-accent px-3 py-1 text-sm text-white">*/}
              {/*    {ratings}*/}
              {/*    <StarIcon className="h-2.5 w-2.5 ltr:ml-1 rtl:mr-1" />*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>

            {product.type === 'Consign' && (
              <span className="my-5 flex flex-col justify-center md:my-10">
                <ins className="text-2xl font-semibold text-accent no-underline md:text-3xl">
                  {price}
                </ins>
                {basePrice && (
                  <del className="text-sm font-normal text-muted ltr:ml-2 rtl:mr-2 md:text-base">
                    {basePrice}
                  </del>
                )}
              </span>
            )}

            {product.type !== 'Consign' && (
              <div className="mt-6 md:mt-6">
                <div className="mb-3 flex items-center space-x-2 text-neutral-500">
                  <TimeIcon />
                  <span className="mt-1 leading-none">
                    Auction {notStarted ? 'Start' : 'Ending'} in:
                  </span>
                </div>

                <div className="flex space-x-5 sm:space-x-10">
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold sm:text-2xl">
                      {day}
                    </span>
                    <span className="text-neutral-500 sm:text-lg">Days</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold sm:text-2xl">
                      {hour}
                    </span>
                    <span className="text-neutral-500 sm:text-lg">hours</span>
                  </div>
                  <div className="flex flex-col ">
                    <span className="text-2xl font-semibold sm:text-2xl">
                      {minute}
                    </span>
                    <span className="text-neutral-500 sm:text-lg">minutes</span>
                  </div>
                  <div className="flex flex-col ">
                    <span className="text-2xl font-semibold sm:text-2xl">
                      {second}
                    </span>
                    <span className="text-neutral-500 sm:text-lg">seconds</span>
                  </div>
                </div>

                <div className="pb-9 pt-14">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                    <div className="relative flex flex-1 flex-col items-baseline rounded-xl border-2 border-accent p-6 sm:flex-row">
                      <span className="absolute bottom-full translate-y-1 bg-white py-1 px-1.5 text-sm text-neutral-500">
                        Current Bid
                      </span>
                      <span className="text-3xl font-semibold text-accent xl:text-4xl">
                        {formatPrice(currentBid)}
                      </span>
                      <span className="text-md text-neutral-400 sm:ml-5">
                        ( next bid{' '}
                        {` ${formatPrice(
                          currentBid + product.multiplied_price
                        )}`}
                        )
                      </span>
                    </div>
                    <span className="ml-5 mt-2 flex flex-col items-end text-sm text-neutral-500 sm:mt-0 sm:ml-10">
                      <div className="">
                        ( start at {formatPrice(product.start_price)})
                      </div>
                      <div className="">
                        ( multiplied at {formatPrice(product.multiplied_price)})
                      </div>
                    </span>
                  </div>
                  {!notStarted && (
                    <>
                      <div className="mt-8 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                        <Button
                          onClick={() => bid(currentBid + multiplied_price)}
                          loading={bidLoading}
                          disabled={bidLoading || ownProduct || !active}
                          className="focus:ring-primary-6000 relative inline-flex h-auto flex-1 items-center justify-center rounded-full bg-accent px-4 py-3 text-sm  font-medium text-neutral-50 transition-colors hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-opacity-70 sm:px-6 sm:text-base "
                        >
                          <WalletBid />
                          <span className="ml-2.5">Place next bid</span>
                        </Button>
                        <Button
                          className="focus:ring-primary-6000 relative inline-flex h-auto flex-1 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 px-4  py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:px-6 sm:text-base "
                          loading={bidLoading}
                          disabled={bidLoading || ownProduct || !active}
                          onClick={() => customBid()}
                        >
                          <PencilBid />
                          <span className="ml-2.5">Custom bid</span>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {product.type === 'Consign' && (
              <div className="mt-6 flex flex-col items-center md:mt-6 lg:flex-row">
                <div className="mb-3 w-full lg:mb-0 lg:max-w-[400px]">
                  <AddToCart
                    disabled={!isAuthorized || ownProduct || !active}
                    data={product}
                    variant="big"
                  />
                </div>

                <>
                  {Number(quantity) > 0 ? (
                    <span className="whitespace-nowrap text-base text-body ltr:lg:ml-7 rtl:lg:mr-7">
                      {quantity} {t('text-pieces-available')}
                    </span>
                  ) : (
                    <div className="whitespace-nowrap text-base text-red-500 ltr:lg:ml-7 rtl:lg:mr-7">
                      {t('text-out-stock')}
                    </div>
                  )}
                </>
              </div>
            )}
          </div>

          {product?.product_category && (
            <CategoryBadges
              categories={[product?.product_category]}
              basePath={`/`}
              onClose={closeModal}
            />
          )}

          <div className="mt-2 flex items-center">
            <span className="py-1 text-sm font-semibold capitalize text-heading ltr:mr-6 rtl:ml-6">
              {t('common:text-dimension')}
            </span>

            <p className="text-sm tracking-wider transition">
              {`${product?.high_dimension} x ${product.long_dimension} x ${product.wide_dimension} cm`}
            </p>
          </div>

          <div className="mt-2 flex items-center">
            <span className="py-1 text-sm font-semibold capitalize text-heading ltr:mr-6 rtl:ml-6">
              {t('common:text-weight')}
            </span>

            <p className="text-sm tracking-wider transition">
              {`${product?.weight} kg`}
            </p>
          </div>

          <div className="mt-2 flex items-center">
            <span className="py-1 text-sm font-semibold capitalize text-heading ltr:mr-6 rtl:ml-6">
              {t('common:text-condition')}
            </span>

            <p className="text-sm tracking-wider transition">
              {product?.condition}
            </p>
          </div>

          <div className="mt-2 flex items-center">
            <span className="py-1 text-sm font-semibold capitalize text-heading ltr:mr-6 rtl:ml-6">
              {t('common:text-warranty')}
            </span>

            <p className="text-sm tracking-wider transition">
              {product?.warranty}
            </p>
          </div>
        </div>
      </div>

      <Element
        name="details"
        className="border-b border-border-200 border-opacity-70 px-5 py-4 lg:px-16 lg:py-14"
      >
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-heading md:mb-6">
          {t('text-details')}
        </h2>
        <p
          className="text-sm text-body"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      </Element>
    </article>
  );
};

export default Details;
