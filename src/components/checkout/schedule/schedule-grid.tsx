import { RadioGroup } from '@headlessui/react';
import { useAtom } from 'jotai';
import ScheduleCard from './schedule-card';
import { addressAtom, deliveryTimeAtom } from '@/store/checkout';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSettings } from '@/framework/settings';
import { useShippingMethod } from '@/framework/checkout';
import useDebounce from '@/lib/hooks/use-debounce';

interface ScheduleProps {
  label: string;
  className?: string;
  count?: number;
}

export const ScheduleGrid: React.FC<ScheduleProps> = ({
  label,
  className,
  count,
}) => {
  const { t } = useTranslation('common');

  const [address] = useAtom(addressAtom);
  const [selectedSchedule, setSchedule] = useAtom(deliveryTimeAtom);

  const debounceAddress = useDebounce(address, 300);
  const { loadShipping, isLoadingShipping, dataShipping } = useShippingMethod();

  useEffect(() => {
    if (debounceAddress?.id) {
      loadShipping({
        user_address_id: debounceAddress.id,
      });
    }
  }, [debounceAddress]);

  return (
    <div className={className}>
      <div className="mb-5 flex items-center justify-between md:mb-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse md:space-x-4">
          {count && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-base text-light lg:text-xl">
              {count}
            </span>
          )}
          <p className="text-lg capitalize text-heading lg:text-xl">{label}</p>
        </div>
      </div>

      {!address && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
            {t('Please select address first')}
          </span>
        </div>
      )}

      {isLoadingShipping && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
            Calculate shipping cost...
          </span>
        </div>
      )}

      {!isLoadingShipping && dataShipping && dataShipping?.length && (
        <RadioGroup value={selectedSchedule} onChange={setSchedule}>
          <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {dataShipping?.map((schedule, idx: number) => (
              <RadioGroup.Option value={schedule} key={idx}>
                {({ checked }) => (
                  <ScheduleCard checked={checked} schedule={schedule} />
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}

      {!isLoadingShipping && dataShipping && dataShipping?.length < 1 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
            {t('text-no-courier-found')}
          </span>
        </div>
      )}
    </div>
  );
};
export default ScheduleGrid;
