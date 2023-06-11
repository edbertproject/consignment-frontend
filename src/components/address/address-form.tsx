import Button from '@/components/ui/button';
import Input from '@/components/ui/forms/input';
import TextArea from '@/components/ui/forms/text-area';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { useModalState } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/forms/form';
import { AddressType } from '@/framework/utils/constants';
import {
  useCreateAddress,
  useSelectCity,
  useSelectDistrict,
  useSelectProvince,
  useUpdateAddress,
  useUpdateUser,
} from '@/framework/user';
import Checkbox from '@/components/ui/forms/checkbox/checkbox';
import { useForm, Controller, useWatch } from 'react-hook-form';
import SelectForm from '@/components/ui/forms/select';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

type FormValues = {
  label: string;
  receiver_name: string;
  phone_number: string;
  full_address: string;
  postal_code: string;
  province: any;
  city: any;
  district: any;
  is_primary: boolean;
  note: string;
};

const addressSchema = yup.object().shape({
  label: yup.string().required('error-label-required'),
  receiver_name: yup.string().required('error-receiver-name-required'),
  phone_number: yup.string().required('error-phone-number-required'),
  full_address: yup.string().required('error-full-address-required'),
  postal_code: yup.string().required('error-postal-code-required'),
  province: yup.object().required('error-province-required'),
  city: yup.object().required('error-city-required'),
  district: yup.object().required('error-district-required'),
  is_primary: yup.boolean().required('error-is-primary-required'),
  note: yup.string().nullable(),
});

export const AddressForm: React.FC<any> = ({
  onSubmit,
  defaultValues,
  isLoading,
}) => {
  const { t } = useTranslation('common');

  const {
    register,
    formState: { errors },
    control,
    watch,
    handleSubmit,
  } = useForm<FormValues>({
    resolver: yupResolver(addressSchema),
    shouldUnregister: true,
    defaultValues,
  });

  const watchProvince = useWatch({
    control,
    name: 'province',
  });

  const watchCity = useWatch({
    control,
    name: 'city',
  });

  const { loadProvince, dataProvince, isLoadingProvince } = useSelectProvince();
  const { loadCity, dataCity, isLoadingCity } = useSelectCity();
  const { loadDistrict, dataDistrict, isLoadingDistrict } = useSelectDistrict();

  useEffect(() => {
    loadProvince({
      page: 1,
      per_page: 9999,
    });
  }, []);

  useEffect(() => {
    if (watchProvince) {
      loadCity({
        page: 1,
        per_page: 9999,
        search: `province_id:${watchProvince.id}`,
      });
    }
  }, [watchProvince]);

  useEffect(() => {
    if (watchCity) {
      loadDistrict({
        page: 1,
        per_page: 9999,
        search: `city_id:${watchCity.id}`,
      });
    }
  }, [watchCity]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid h-full grid-cols-2 gap-5"
    >
      <>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Checkbox
            label={t('text-is-primary')}
            type="checkbox"
            {...register('is_primary')}
            error={t(errors.is_primary?.message!)}
            className="col-span-2"
          />
        </div>

        <Input
          label={t('text-label')}
          {...register('label')}
          error={t(errors.label?.message!)}
          variant="outline"
          className="col-span-2"
        />

        <Input
          label={t('text-receiver-name')}
          {...register('receiver_name')}
          error={t(errors.receiver_name?.message!)}
          variant="outline"
          className="col-span-2"
        />

        <Input
          label={t('text-phone-number')}
          {...register('phone_number')}
          error={t(errors.phone_number?.message!)}
          type="number"
          variant="outline"
          className="col-span-2"
        />

        <Input
          label={t('text-postal-code')}
          {...register('postal_code')}
          error={t(errors.postal_code?.message!)}
          type="number"
          variant="outline"
          className="col-span-2"
        />

        <Controller
          name="province"
          control={control}
          rules={{ required: 'Please select a province' }}
          render={({ field: { onChange, value } }) => (
            <SelectForm
              label={t('text-province')}
              name="province"
              error={t(errors.province?.message!)}
              isLoading={isLoadingProvince}
              options={dataProvince?.data}
              onChange={onChange}
              formatOptionLabel={(data: any) => data.name}
              value={value}
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          rules={{ required: 'Please select a city' }}
          render={({ field: { onChange, value } }) => (
            <SelectForm
              label={t('text-city')}
              name="city"
              error={t(errors.city?.message!)}
              isLoading={isLoadingCity}
              options={dataCity?.data}
              onChange={onChange}
              formatOptionLabel={(data: any) => data.name}
              value={value}
            />
          )}
        />

        <Controller
          name="district"
          control={control}
          rules={{ required: 'Please select a district' }}
          render={({ field: { onChange, value } }) => (
            <SelectForm
              label={t('text-district')}
              name="district"
              error={t(errors.district?.message!)}
              isLoading={isLoadingDistrict}
              options={dataDistrict?.data}
              onChange={onChange}
              formatOptionLabel={(data: any) => data.name}
              value={value}
            />
          )}
        />

        <TextArea
          label={t('text-full-address')}
          {...register('full_address')}
          error={t(errors.full_address?.message!)}
          variant="outline"
          className="col-span-2"
        />

        <TextArea
          label={t('text-note')}
          {...register('note')}
          error={t(errors.note?.message!)}
          variant="outline"
          className="col-span-2"
        />

        <Button
          className="col-span-2 w-full"
          type="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          {Boolean(defaultValues.id) ? t('text-update') : t('text-save')}{' '}
          {t('text-address')}
        </Button>
      </>
    </form>
  );
};

export default function CreateOrUpdateAddressForm() {
  const { t } = useTranslation('common');
  const {
    data: { customerId, address, type },
  } = useModalState();
  const { mutate: createAddress, isLoading: isLoadingCreate } =
    useCreateAddress();
  const { mutate: updateAddress, isLoading: isLoadingUpdate } =
    useUpdateAddress();

  function onSubmit(values: FormValues) {
    const formattedInput = {
      id: address?.id,
      province_id: values.province.id,
      city_id: values.city.id,
      district_id: values.district.id,
      ...values,
    };
    if (formattedInput.id) {
      updateAddress({ id: address?.id, payload: formattedInput });
    } else {
      createAddress(formattedInput);
    }
  }
  return (
    <div className="min-h-screen bg-light p-5 sm:w-[350px] sm:p-8 md:min-h-0 md:w-[400px] md:w-[600px] md:rounded-xl">
      <h1 className="mb-4 text-center text-lg font-semibold text-heading sm:mb-6">
        {address ? t('text-update') : t('text-add-new')} {t('text-address')}
      </h1>
      <AddressForm
        onSubmit={onSubmit}
        isLoading={isLoadingCreate || isLoadingUpdate}
        defaultValues={{
          title: address?.title ?? '',
          ...address,
        }}
      />
    </div>
  );
}
