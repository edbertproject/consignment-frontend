import { useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import client from '@/framework/client';
import { toast } from 'react-toastify';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';

export function useCheckOrder(language: string) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [_, closeSidebar] = useAtom(drawerAtom);
  const { mutate, isLoading, isSuccess } = useMutation(
    client.checkouts.verify,
    {
      onSuccess: (data) => {
        router.push(Routes.checkout, undefined, {
          locale: language,
        });

        closeSidebar({ display: false, view: '' });
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(t(data?.message));
      },
    }
  );

  return { checkOrder: mutate, isLoading, isSuccess };
}

export const useShippingMethod = () => {
  const { t } = useTranslation('common');

  const { mutate, isLoading, isSuccess, data } = useMutation(
    client.shippings.calculate,
    {
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(t(data?.message));
      },
    }
  );

  return {
    loadShipping: mutate,
    dataShipping: data?.data,
    isLoadingShipping: isLoading,
    isSuccess,
  };
};

export const usePaymentMethod = () => {
  const { t } = useTranslation('common');

  const { mutate, isLoading, isSuccess, data } = useMutation(
    client.checkouts.paymentMethod,
    {
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(t(data?.message));
      },
    }
  );

  return {
    loadShipping: mutate,
    dataShipping: data?.data,
    isLoadingShipping: isLoading,
    isSuccess,
  };
};
