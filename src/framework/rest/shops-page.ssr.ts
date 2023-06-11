import type { ShopQueryOptions, TypeQueryOptions } from '@/types';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { SHOPS_PER_PAGE, TYPES_PER_PAGE } from './client/variables';
import { SettingsQueryOptions } from '@/types';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.SHOPS, { limit: SHOPS_PER_PAGE, is_active: 1 }],
    ({ queryKey }) => client.shops.all(queryKey[1] as ShopQueryOptions)
  );
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'banner'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
