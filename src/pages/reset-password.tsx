import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import Seo from '@/components/seo/seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  useRegister,
  useRegisterVerify,
  useResetPassword,
} from '@/framework/user';
import React, { useEffect, useMemo } from 'react';
import Button from '@/components/ui/button';
import * as yup from 'yup';
import { ResetPasswordUserInput } from '@/types';
import PasswordInput from '@/components/ui/forms/password-input';
import { ArrowPrevIcon } from '@/components/icons/arrow-prev';
import { Form } from '@/components/ui/forms/form';
import { SubmitHandler } from 'react-hook-form';
import Alert from '@/components/ui/alert';

const passwordFormValidation = yup.object().shape({
  password: yup.string().required(),
});

export default function ResetPasswordPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query } = router;

  const { mutate, isLoading, serverError, setServerError } = useResetPassword();

  const passwordFormHandle: SubmitHandler<
    Pick<ResetPasswordUserInput, 'password'>
  > = ({ password }) => {
    mutate({
      password,
      token: query.token as string,
      email: query.email as string,
    });
  };

  return (
    <>
      <Seo title="Verification" url="verification" />
      <section className="mt-10 flex h-full w-full justify-center align-middle">
        <div className="w-1/3 rounded">
          <Alert
            variant="error"
            message={serverError && t(serverError)}
            className="mb-6"
            closeable={true}
            onClose={() => setServerError(null)}
          />
          <Form<Pick<ResetPasswordUserInput, 'password'>>
            onSubmit={passwordFormHandle}
            useFormProps={{
              defaultValues: { password: '' },
            }}
            validationSchema={passwordFormValidation}
          >
            {({ register, formState: { errors } }) => (
              <>
                <PasswordInput
                  label={t('text-new-password')}
                  {...register('password')}
                  error={t(errors.password?.message!)}
                />
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Button
                    className="w-full text-sm tracking-[0.2px] sm:order-2"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {t('text-reset-password')}
                  </Button>
                </div>
              </>
            )}
          </Form>
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
