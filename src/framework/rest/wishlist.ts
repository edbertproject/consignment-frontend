import type {
  BasicResponse,
  WishlistPaginator,
  WishlistQueryOptions,
} from '@/types';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { toast } from 'react-toastify';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from './utils/data-mappers';
import { useRouter } from 'next/router';
import { BasicResponseData } from '@/types';

export function useToggleWishlist(product_id: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const {
    mutate: toggleWishlist,
    isLoading,
    isSuccess,
  } = useMutation(client.wishlist.toggle, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(t('text-added-to-wishlist'));
        queryClient.refetchQueries([API_ENDPOINTS.WISHLIST]);
        queryClient.refetchQueries([`${API_ENDPOINTS.WISHLIST}/in_wishlist`]);
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(t(error.response?.data.message));
      }
    },
  });

  return { toggleWishlist, isLoading, isSuccess };
}

export function useRemoveFromWishlist() {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const {
    mutate: removeFromWishlist,
    isLoading,
    isSuccess,
  } = useMutation(client.wishlist.remove, {
    onSuccess: () => {
      toast.success(t('text-removed-from-wishlist'));
      queryClient.refetchQueries([API_ENDPOINTS.WISHLIST]);
      queryClient.refetchQueries([`${API_ENDPOINTS.WISHLIST}/in_wishlist`]);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(t(error.response?.data.message));
      }
    },
  });

  return { removeFromWishlist, isLoading, isSuccess };
}

export function useWishlist(options?: WishlistQueryOptions) {
  const formattedOptions = {
    ...options,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<WishlistPaginator, Error>(
    [API_ENDPOINTS.WISHLIST, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.wishlist.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ meta }) =>
        meta.last_page > meta.current_page && { page: meta.current_page + 1 },
    }
  );
  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    wishlists: data?.pages?.flatMap((page) => page.data) ?? [],
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

export function useInWishlist({
  enabled,
  product_id,
}: {
  product_id: number;
  enabled: boolean;
}) {
  const { data, isLoading, error, refetch } = useQuery<
    BasicResponseData<boolean>,
    Error
  >(
    [`${API_ENDPOINTS.WISHLIST}/in_wishlist`, product_id],
    () => client.wishlist.checkIsInWishlist({ product_id }),
    {
      enabled,
    }
  );
  return {
    inWishlist: Boolean(data?.data) ?? false,
    isLoading,
    error,
    refetch,
  };
}
