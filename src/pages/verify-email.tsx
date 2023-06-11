import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import Seo from '@/components/seo/seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRegister, useRegisterVerify } from '@/framework/user';
import React, { useEffect, useMemo } from 'react';
import Button from '@/components/ui/button';

function makeTitleToDOMId(title: string) {
  return title.toLowerCase().split(' ').join('_');
}

export default function VerifyEmailPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query } = router;

  const { mutate, isLoading, serverError, setServerError } =
    useRegisterVerify();

  useEffect(() => {
    if (query.is_success && query.token) {
      mutate({
        token: query.token as string,
      });
    }
  }, [query.is_success, query.token]);

  return (
    <>
      <Seo title="Verification" url="verification" />
      <section className="mt-10 flex h-full w-full justify-center align-middle">
        <div className="w-1/3 rounded">
          {!isLoading && (
            <>
              <h1 className="text-xl font-bold">Thanks for verification</h1>
              <p className="mt-3">
                Your account has been activated, now you can login and start
                using consignx to shop and bid.
              </p>
              <Link href="/">
                <Button size="small" className="mt-2 ">
                  {t('text-home')}
                </Button>
              </Link>
            </>
          )}
          {isLoading && <p>Please wait...</p>}
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'terms'])),
    },
  };
};
