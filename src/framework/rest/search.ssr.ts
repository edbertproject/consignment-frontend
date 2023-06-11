import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';
import { QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/framework/client/api-endpoints';
import { dehydrate } from 'react-query/hydration';
import client from '@/framework/client';
import {
  CategoryQueryOptions,
  SettingsQueryOptions,
  TypeQueryOptions,
} from '@/types';
import { TYPES_PER_PAGE } from '@/framework/client/variables';

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const queryClient = new QueryClient();
  const categoryVariable = {
    limit: 1000,
    parent: 'null',
    language: locale,
  };

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.CATEGORIES, categoryVariable],
    ({ queryKey }) => client.categories.all(queryKey[1] as CategoryQueryOptions)
  );

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
