import classNames from 'classnames';
import { Shipping } from '@/types';
import { formatPrice } from '@/lib/use-price';

interface ScheduleProps {
  schedule: Shipping;
  checked: boolean;
}
const ScheduleCard: React.FC<ScheduleProps> = ({ checked, schedule }) => (
  <div
    className={classNames(
      'group relative cursor-pointer rounded border p-4 hover:border-accent',
      {
        'border-accent shadow-sm': checked,
        'border-transparent bg-gray-100': !checked,
      }
    )}
  >
    <span className="mb-2 block text-sm font-semibold text-heading">
      {schedule.name}
    </span>
    <span className="block text-sm text-heading">{schedule.description}</span>
    <span className="block text-sm text-heading">
      {schedule.estimation_day}
    </span>
    <span className="block text-sm text-heading">
      {formatPrice(schedule.cost)}
    </span>
  </div>
);

export default ScheduleCard;
