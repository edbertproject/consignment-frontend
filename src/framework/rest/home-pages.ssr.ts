import type {
  CategoryQueryOptions,
  HomePageProps,
  NewProductQueryOptions,
  SettingsQueryOptions,
  TypeQueryOptions,
} from '@/types';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { CATEGORIES_PER_PAGE } from './client/variables';
import { HotProductQueryOptions } from '@/types';

type ParsedQueryParams = {
  pages: string[];
};

export const getStaticProps: GetStaticProps<
  HomePageProps,
  ParsedQueryParams
> = async ({ locale, params }) => {
  const queryClient = new QueryClient();

  const hotProductVariables = {
    per_page: 5,
    page: 1,
    with: 'photo',
    variety: 'hot',
  };

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.PRODUCTS, hotProductVariables],
    ({ queryKey }) =>
      client.products.home(queryKey[1] as HotProductQueryOptions)
  );

  const newProductVariables = {
    per_page: 5,
    page: 1,
    with: 'photo',
    variety: 'featuring',
  };

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.PRODUCTS, newProductVariables],
    ({ queryKey }) =>
      client.products.home(queryKey[1] as NewProductQueryOptions)
  );

  const incomingProductVariables = {
    per_page: 5,
    page: 1,
    with: 'photo',
    variety: 'incoming',
  };

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.PRODUCTS, incomingProductVariables],
    ({ queryKey }) =>
      client.products.home(queryKey[1] as NewProductQueryOptions)
  );

  const categoryVariables = {
    per_page: CATEGORIES_PER_PAGE,
    with: 'photo',
  };
  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.CATEGORIES, categoryVariables],
    ({ queryKey }) => client.categories.all(queryKey[1] as CategoryQueryOptions)
  );

  return {
    props: {
      variables: {
        newProducts: newProductVariables,
        hotProducts: hotProductVariables,
        categories: categoryVariables,
        incomingProducts: incomingProductVariables,
      },
      ...(await serverSideTranslations(locale!, ['common', 'banner'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 120,
  };
};

/* Fix : locales: 14kB,
popularProducts: 30kB,
category: 22kB,
groups: 8kB,
group: 2kB,
settings: 2kB,
perProduct: 4.2 * 30 = 120kB,
total = 14 + 30 + 22 + 8 + 2 + 2 + 120 = 198kB
others: 225 - 198 = 27kB

 */
