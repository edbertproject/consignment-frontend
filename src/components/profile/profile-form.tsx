import Button from '@/components/ui/button';
import Card from '@/components/ui/cards/card';
import FileInput from '@/components/ui/forms/file-input';
import Input from '@/components/ui/forms/input';
import { useTranslation } from 'next-i18next';
import pick from 'lodash/pick';
import { Form } from '@/components/ui/forms/form';
import { Controller } from 'react-hook-form';
import { useUpdateUser } from '@/framework/user';
import type { UpdateUserInput, User } from '@/types';
import Select from '@/components/ui/select/select';
import DatePickerForm from '@/components/ui/forms/date-picker';
import Alert from '@/components/ui/alert';
import dayjs from 'dayjs';

const ProfileForm = ({ user }: { user: User }) => {
  const { t } = useTranslation('common');
  const {
    mutate: updateProfile,
    isLoading,
    serverError,
    setServerError,
  } = useUpdateUser();

  const genderOptions = [
    {
      id: '1',
      key: 'Male',
      label: 'Male',
      value: 'Male',
    },
    {
      id: '2',
      key: 'Female',
      label: 'Female',
      value: 'Female',
    },
  ];

  function onSubmit(values: UpdateUserInput) {
    if (!user) {
      return false;
    }

    updateProfile({
      id: user.id,
      name: values.name,
      phone_number: values.phone_number,
      date_of_birth: dayjs(values.date_of_birth).format('YYYY-MM-DD'),
      gender: values.gender.value,
      bank_name: values.bank_name,
      bank_number: values.bank_number,
      photo: values.photo,
    });
  }

  return (
    <>
      <Alert
        variant="error"
        message={serverError}
        className="mb-6"
        closeable={true}
        onClose={() => setServerError(null)}
      />
      <Form<UpdateUserInput>
        onSubmit={onSubmit}
        useFormProps={{
          ...(user && {
            defaultValues: {
              ...pick(user, [
                'name',
                'phone_number',
                'date_of_birth',
                'bank_name',
                'bank_number',
              ]),
              gender: genderOptions.find(
                (gender) => gender.value === user.gender
              ),
            },
          }),
        }}
      >
        {({ register, control }) => (
          <>
            <div className="mb-8 flex">
              <Card className="w-full">
                {/*<div className="mb-8 md:w-full lg:w-1/2">*/}
                {/*  <FileInput label="Photo" control={control} name="photo" />*/}
                {/*</div>*/}

                <div className="mb-6 flex flex-row">
                  <Input
                    className="flex-1"
                    label={t('text-name')}
                    {...register('name')}
                    variant="outline"
                    required
                  />
                </div>

                <div className="mb-6 flex flex-row">
                  <Input
                    className="flex-1"
                    label={t('text-phone-number')}
                    {...register('phone_number')}
                    variant="outline"
                    type="number"
                    required
                  />
                </div>

                <div className="mb-6 flex flex-row">
                  <div className="flex-1">
                    <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                      {t('text-date-of-birth')}
                    </label>

                    <Controller
                      control={control}
                      rules={{ required: true }}
                      name="date_of_birth"
                      render={({ field }) => (
                        <DatePickerForm
                          selected={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mb-6 flex flex-row">
                  <div className="flex-1">
                    <label className="mb-3 block text-sm font-semibold leading-none text-body-dark">
                      {t('text-gender')}
                    </label>
                    <Controller
                      control={control}
                      rules={{ required: true }}
                      name="gender"
                      render={({ field }) => (
                        <Select
                          options={genderOptions}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mb-6 flex flex-row">
                  <Input
                    className="flex-1"
                    label={t('text-bank')}
                    {...register('bank_name')}
                    variant="outline"
                    required
                  />
                </div>

                <div className="mb-6 flex flex-row">
                  <Input
                    className="flex-1"
                    label={t('text-bank-number')}
                    {...register('bank_number')}
                    variant="outline"
                    type="number"
                    required
                  />
                </div>

                <div className="flex">
                  <Button
                    className="ltr:ml-auto rtl:mr-auto"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {t('text-save')}
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default ProfileForm;
