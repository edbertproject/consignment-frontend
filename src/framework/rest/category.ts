import type { CategoryPaginator, CategoryQueryOptions } from '@/types';
import { useInfiniteQuery, useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { useRouter } from 'next/router';

export function useCategories(options?: Partial<CategoryQueryOptions>) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<CategoryPaginator, Error>(
    [API_ENDPOINTS.CATEGORIES, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.categories.all(Object.assign({}, queryKey[1], pageParam))
  );

  return {
    categories: response?.data,
    isLoading,
    error,
  };
}
