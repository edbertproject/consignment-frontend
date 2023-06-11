import type {
  Product,
  ProductPaginator,
  ProductQueryOptions,
  QuestionPaginator,
  QuestionQueryOptions,
  GetParams,
} from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { formatProductsArgs } from '@/framework/utils/format-products-args';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import {
  BidPaginator,
  CartItem,
  HotProductQueryOptions,
  IncomingProductQueryOptions,
  NewProductQueryOptions,
  PaginatorInfo,
  ProductBidQueryOptions,
  ReviewPaginator,
  ReviewQueryOptions,
} from '@/types';
import axios from 'axios';

export function useCarts(options?: Partial<ProductQueryOptions>) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...formatProductsArgs(options),
    language: locale,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.products.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ meta }) =>
        meta.last_page > meta.current_page && {
          page: meta.current_page + 1,
        },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    products: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export function useServerCart() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const { mutate, isLoading, isSuccess } = useMutation(client.carts.update, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(t(data?.message));
    },
  });

  return { updateCart: mutate, isLoading, isSuccess };
}
