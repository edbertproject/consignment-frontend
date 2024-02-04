import ErrorMessage from '@/components/ui/error-message';
import { useTranslation } from 'next-i18next';
import NotFound from '@/components/ui/not-found';
import rangeMap from '@/lib/range-map';
import dayjs from 'dayjs';
import QuestionLoader from '@/components/ui/loaders/question-loader';
import Link from '@/components/ui/link';
import usePrice from '@/lib/use-price';
import { useMyNotification } from '@/framework/notification';
import { Notification } from '@/types';

function NotificationItem({ notification }: { notification: Notification }) {
  const { data, type, created_at } = notification;
  const { t } = useTranslation('common');

  return (
    <div className="border-t border-border-200 border-opacity-70 py-7 first:border-t-0">
      <Link href="">
        <div className="rounded-md bg-gray-50 py-3 px-4">
          <p className="mb-2.5 text-base font-semibold text-heading">
            {data.subject}
          </p>
          <p className="text-base">
            <span className="text-gray-600">{data.message}</span>
          </p>

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
  const { notifications, isLoading, error } = useMyNotification();

  if (error) return <ErrorMessage message={error.message} />;

  // loader
  if (!notifications.length && isLoading) {
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

  if (!notifications.length && !isLoading) {
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
          {notifications?.map((item: any) => (
            <NotificationItem key={item.id} notification={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyNotifications;
