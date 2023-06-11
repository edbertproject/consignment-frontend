import type { Settings } from '@/types';
import { useMutation, useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import { getPreviewImage } from '@/lib/get-preview-image';
import { useAtom } from 'jotai';
import { couponAtom } from '@/store/checkout';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export function useSettings() {
  // const { data, isLoading, error } = useQuery<Settings, Error>(
  //   [API_ENDPOINTS.SETTINGS, formattedOptions],
  //   ({ queryKey, pageParam }) =>
  //     client.settings.all(Object.assign({}, queryKey[1], pageParam))
  // );

  return {
    settings: {
      siteTitle: 'Consignx',
      siteSubtitle: 'Your next consignment',
      minimumOrderAmount: 0,
      currencyToWalletRatio: 3,
      signupPoints: 100,
      maximumQuestionLimit: 5,
      seo: {
        metaTitle: 'Consignx',
        metaDescription: 'Your next consignment',
        metaTags: null,
        canonicalUrl: null,
        ogTitle: null,
        ogDescription: null,
        twitterHandle: null,
        twitterCardType: null,
        ogImage: null,
      },
      deliveryTime: [
        { title: 'JNE', description: '90 min express delivery' },
        { title: 'TIKI', description: '8.00 AM - 11.00 AM' },
        { title: 'SI CEPAT', description: '11.00 AM - 2.00 PM' },
      ],
      contactDetails: {
        contact: '+129290122122',
        website: 'https://redq.io',
        socials: [
          { icon: 'FacebookIcon', url: 'https://www.facebook.com/' },
          { icon: 'TwitterIcon', url: 'https://twitter.com/home' },
          { icon: 'InstagramIcon', url: null },
        ],
        location: {
          lat: 42.9585979,
          lng: -76.90872019999999,
          zip: null,
          city: null,
          state: 'NY',
          country: 'United States',
          formattedAddress: 'NY State Thruway, New York, USA',
        },
      },
      logo: {
        id: '862',
        original:
          'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/860/PickBazar.png',
        thumbnail:
          'https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/860/conversions/PickBazar-thumbnail.jpg',
      },
      currency: 'IDR',
      useOtp: false,
      taxClass: 1,
      shippingClass: 1,
      useCashOnDelivery: true,
      paymentGateway: 'stripe',
    },
    isLoading: false,
    error: null,
  };
}

export const useUploads = ({ onChange, defaultFiles }: any) => {
  const [files, setFiles] = useState<FileWithPath[]>(
    getPreviewImage(defaultFiles)
  );

  const { mutate: upload, isLoading } = useMutation(client.settings.upload, {
    onSuccess: (data) => {
      if (onChange) {
        const dataAfterRemoveTypename = data?.map(
          ({ __typename, ...rest }: any) => rest
        );
        onChange(dataAfterRemoveTypename);
        setFiles(getPreviewImage(dataAfterRemoveTypename));
      }
    },
  });

  function handleSubmit(data: File[]) {
    upload(data);
  }

  return { mutate: handleSubmit, isLoading, files };
};

export function useSubscription() {
  let [isSubscribed, setIsSubscribed] = useState(false);

  const subscription = useMutation(client.users.subscribe, {
    onSuccess: () => {
      setIsSubscribed(true);
    },
    onError: () => {
      setIsSubscribed(false);
    },
  });

  return {
    ...subscription,
    isSubscribed,
  };
}

export function useVerifyCoupon() {
  const { t } = useTranslation();
  const [_, applyCoupon] = useAtom(couponAtom);
  let [formError, setFormError] = useState<any>(null);
  const { mutate, isLoading } = useMutation(client.coupons.verify, {
    onSuccess: (data: any) => {
      if (!data.is_valid) {
        setFormError({
          code: t(`common:${data?.message}`),
        });
      }
      applyCoupon(data?.coupon);
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
  });

  return { mutate, isLoading, formError, setFormError };
}
