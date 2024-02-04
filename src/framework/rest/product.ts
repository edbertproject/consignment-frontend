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
  HotProductQueryOptions,
  IncomingProductQueryOptions,
  NewProductQueryOptions,
  PaginatorInfo,
  ProductBidQueryOptions,
  ReviewPaginator,
  ReviewQueryOptions,
  SingleData,
} from '@/types';
import axios from 'axios';

export function useProducts(options?: Partial<ProductQueryOptions>) {
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

export const useHotProducts = (options?: Partial<HotProductQueryOptions>) => {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<PaginatorInfo<Product>, Error>(
    [API_ENDPOINTS.PRODUCTS, formattedOptions],
    ({ queryKey }) =>
      client.products.home(queryKey[1] as HotProductQueryOptions)
  );

  return {
    products: response?.data ?? [],
    isLoading,
    error,
  };
};

export const useNewProduct = (options?: Partial<NewProductQueryOptions>) => {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<PaginatorInfo<Product>, Error>(
    [API_ENDPOINTS.PRODUCTS, formattedOptions],
    ({ queryKey }) =>
      client.products.home(queryKey[1] as NewProductQueryOptions)
  );

  return {
    products: response?.data ?? [],
    isLoading,
    error,
  };
};

export const useIncomingProduct = (
  options?: Partial<IncomingProductQueryOptions>
) => {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<PaginatorInfo<Product>, Error>(
    [API_ENDPOINTS.PRODUCTS, formattedOptions],
    ({ queryKey }) =>
      client.products.home(queryKey[1] as IncomingProductQueryOptions)
  );

  return {
    products: response?.data ?? [],
    isLoading,
    error,
  };
};

export function useProduct(slug: string) {
  const { locale: language } = useRouter();

  const { data, isLoading, error } = useQuery<SingleData<Product>, Error>(
    [API_ENDPOINTS.PRODUCTS, { slug }],
    () => client.products.get({ slug })
  );
  return {
    product: data?.data,
    isLoading,
    error,
  };
}

export function useBids(options: Partial<ProductBidQueryOptions>) {
  const {
    data: response,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery<BidPaginator, Error>(
    [`${API_ENDPOINTS.PRODUCTS}/${options?.product_id}/bid`, options],
    ({ queryKey }) =>
      client.products.allBid(
        Object.assign({}, queryKey[1] as ProductBidQueryOptions)
      ),
    {
      keepPreviousData: true,
    }
  );
  return {
    bids: response?.data ?? [],
    paginatorInfo: mapPaginatorData(response),
    isLoading,
    error,
    refetch,
    isFetching,
    hasMore: response && response?.meta.last_page > response?.meta.current_page,
  };
}

export function useBid(product_id: number) {
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();
  const { t } = useTranslation('common');
  const {
    mutate: bidProduct,
    isLoading,
    isSuccess,
  } = useMutation(client.products.bid, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.refetchQueries(`${API_ENDPOINTS.PRODUCTS}/${product_id}/bid`);
      closeModal();
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(t(data?.message));
    },
  });

  return { bidProduct, isLoading, isSuccess };
}

export function useQuestions(options?: Partial<QuestionQueryOptions>) {
  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useQuery<QuestionPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS_QUESTIONS, options],
    ({ queryKey }) =>
      client.products.questions(
        Object.assign({}, queryKey[1] as QuestionQueryOptions)
      ),
    {
      keepPreviousData: true,
    }
  );
  return {
    questions: response?.data ?? [],
    paginatorInfo: mapPaginatorData(response),
    isLoading,
    error,
    isFetching,
  };
}

export function useCreateFeedback() {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const { mutate: createFeedback, isLoading } = useMutation(
    client.products.createFeedback,
    {
      onSuccess: (res) => {
        toast.success(t('text-feedback-submitted'));
        queryClient.refetchQueries(API_ENDPOINTS.PRODUCTS_QUESTIONS);
        queryClient.refetchQueries(API_ENDPOINTS.PRODUCTS_REVIEWS);
      },
    }
  );
  return {
    createFeedback,
    isLoading,
  };
}

export function useCreateAbuseReport() {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const { mutate: createAbuseReport, isLoading } = useMutation(
    client.products.createAbuseReport,
    {
      onSuccess: () => {
        toast.success(t('text-abuse-report-submitted'));
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(t(data?.message));
      },
      onSettled: () => {
        closeModal();
      },
    }
  );
  return {
    createAbuseReport,
    isLoading,
  };
}

export function useCreateQuestion() {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const { mutate: createQuestion, isLoading } = useMutation(
    client.products.createQuestion,
    {
      onSuccess: () => {
        toast.success(t('text-question-submitted'));
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(t(data?.message));
      },
      onSettled: () => {
        queryClient.refetchQueries(API_ENDPOINTS.PRODUCTS_QUESTIONS);
        closeModal();
      },
    }
  );
  return {
    createQuestion,
    isLoading,
  };
}
