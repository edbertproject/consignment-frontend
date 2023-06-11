import { useTranslation } from 'next-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import cn from 'classnames';
import Rating from '@/components/ui/rating-badge';
import dayjs from 'dayjs';
import { Image } from '@/components/ui/image';
import { CheckedIcon } from '@/components/icons/checked';
import { LikeIcon } from '@/components/icons/like-icon';
import { MenuIcon } from '@/components/icons/menu-icon';
import { DislikeIcon } from '@/components/icons/dislike-icon';
import { productPlaceholder } from '@/lib/placeholders';
import { useCreateFeedback } from '@/framework/product';
import type { Bid, Review } from '@/types';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useUser } from '@/framework/user';
import { formatPrice } from '@/lib/use-price';
type BidCardProps = {
  bid: Bid;
};

export default function BidCard({ bid }: BidCardProps) {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();
  const { isAuthorized } = useUser();

  const { id, amount, date_time, user_name } = bid;

  return (
    <div className="border-t border-border-200 border-opacity-70 py-7 first:border-t-0">
      <div className="mb-4 flex items-center text-xs text-gray-500">
        {t('text-by')}{' '}
        <span className="capitalize ltr:ml-1 rtl:mr-1">{user_name}</span>
      </div>
      <p className="text-base leading-7 text-heading">{formatPrice(amount)}</p>

      <div className="flex items-center justify-between">
        <div className="mt-3.5 text-xs text-gray-400">
          {t('text-date')}: {dayjs(date_time).format('h:mm:ss A D MMMM YYYY')}
        </div>
      </div>
    </div>
  );
}
