import ErrorMessage from '@/components/ui/error-message';
import { useTranslation } from 'next-i18next';
import Button from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import type { Question } from '@/types';
import rangeMap from '@/lib/range-map';
import { useMyQuestions } from '@/framework/question';
import dayjs from 'dayjs';
import { LikeIcon } from '@/components/icons/like-icon';
import { DislikeIcon } from '@/components/icons/dislike-icon';
import QuestionLoader from '@/components/ui/loaders/question-loader';
import Link from '@/components/ui/link';
import { Image } from '@/components/ui/image';
import { Routes } from '@/config/routes';
import { productPlaceholder } from '@/lib/placeholders';
import usePrice from '@/lib/use-price';

function NotificationItem({ question }: { question: Question }) {
  const {
    question: myQuestion,
    answer,
    created_at,
    positive_feedbacks_count,
    negative_feedbacks_count,
    product,
  } = question;
  const { t } = useTranslation('common');

  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price,
    baseAmount: product?.price,
  });
  const { price: minPrice } = usePrice({
    amount: product?.min_price,
  });
  const { price: maxPrice } = usePrice({
    amount: product?.max_price,
  });

  return (
    <div className="border-t border-border-200 border-opacity-70 py-7 first:border-t-0">
      <Link href="">
        <div className="rounded-md bg-gray-50 py-3 px-4">
          <p className="mb-2.5 text-base font-semibold text-heading">
            Bid Won
          </p>
          {answer && (
              <p className="text-base">
                <span className="text-gray-600">{answer}</span>
              </p>
          )}

          <div className="flex items-center justify-between">
            <div className="mt-5 text-xs text-gray-400">
              {t('text-date')}: {dayjs(created_at).format('D MMMM, YYYY')}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

const MyNotifications: React.FC = () => {
  const { t } = useTranslation('common');
  const { questions, isLoading, isLoadingMore, error, hasMore, loadMore } =
    useMyQuestions();

  if (error) return <ErrorMessage message={error.message} />;

  // loader
  if (!questions.length && isLoading) {
    return (
      <div className="flex w-full flex-col">
        <div className="mb-8 flex items-center justify-center sm:mb-10">
          <h1 className="text-center text-lg font-semibold text-heading sm:text-xl">
            {t('profile-sidebar-my-wishlist')}
          </h1>
        </div>
        {rangeMap(15, (i) => (
          <QuestionLoader key={i} uniqueKey={`favorite-${i}`} />
        ))}
      </div>
    );
  }

  if (!questions.length && !isLoading) {
    return (
      <div className="flex w-full flex-col">
        <div className="mb-8 flex items-center justify-between sm:mb-10">
          <h1 className="ml-auto text-center text-lg font-semibold text-heading sm:text-xl">
            {t('profile-sidebar-my-notification')}
          </h1>
        </div>
        <NotFound
          text="text-no-download"
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
            {t('profile-sidebar-my-notification')}
          </h1>
        </div>
        <div>
          {questions?.map((item:any) => (
            <NotificationItem key={item.id} question={item} />
          ))}
        </div>
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

export default MyNotifications;
