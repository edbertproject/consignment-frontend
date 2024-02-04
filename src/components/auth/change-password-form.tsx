import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/forms/password-input';
import type { ChangePasswordUserInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { Form } from '@/components/ui/forms/form';
import { useChangePassword } from '@/framework/user';
import * as yup from 'yup';

export const changePasswordSchema = yup.object().shape({
  old_password: yup.string().required('error-old-password-required'),
  password: yup.string().required('error-new-password-required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'error-match-passwords')
    .required('error-confirm-password'),
});

export default function ChangePasswordForm() {
  const { t } = useTranslation('common');
  const {
    mutate: changePassword,
    isLoading: loading,
    formError,
  } = useChangePassword();

  function onSubmit({
    password,
    old_password,
    password_confirmation,
  }: ChangePasswordUserInput) {
    changePassword({
      old_password,
      password,
      password_confirmation,
    });
  }

  return (
    <Form<ChangePasswordUserInput>
      onSubmit={onSubmit}
      validationSchema={changePasswordSchema}
      className="flex flex-col"
      serverError={formError}
    >
      {({ register, formState: { errors } }) => (
        <>
          <PasswordInput
            label={t('text-old-password')}
            {...register('old_password')}
            error={t(errors.old_password?.message!)}
            className="mb-5"
            variant="outline"
          />
          <PasswordInput
            label={t('text-new-password')}
            {...register('password')}
            error={t(errors.password?.message!)}
            className="mb-5"
            variant="outline"
          />
          <PasswordInput
            label={t('text-confirm-password')}
            {...register('password_confirmation')}
            error={t(errors.password_confirmation?.message!)}
            className="mb-5"
            variant="outline"
          />
          <Button
            loading={loading}
            disabled={loading}
            className="ltr:ml-auto rtl:mr-auto"
          >
            {t('text-submit')}
          </Button>
        </>
      )}
    </Form>
  );
}
