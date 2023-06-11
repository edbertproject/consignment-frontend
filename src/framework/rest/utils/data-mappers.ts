import camelCaseKeys from 'camelcase-keys';
import { Meta } from '@/types';
interface Paginator {
  meta: Meta;
  data?: any[];
}
export const mapPaginatorData = (obj: Paginator | undefined) => {
  if (!obj) return null;
  const { data, ...formattedValues } = camelCaseKeys(obj);
  ``;
  return {
    ...formattedValues,
    hasMorePages:
      formattedValues.meta.last_page !== formattedValues.meta.current_page,
    firstItem: formattedValues.meta.from,
    lastItem: formattedValues.meta.to,
    total: formattedValues.meta.total,
  };
};
