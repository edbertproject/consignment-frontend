import { useTranslation } from 'next-i18next';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Controller } from 'react-hook-form';
import Button from '@/components/ui/button';
import { Form } from '@/components/ui/forms/form';
import * as yup from 'yup';
import Input from '@/components/ui/forms/input';
import { useBid } from '@/framework/product';

type FormValues = {
  amount: number;
};

const customBidSchema = yup.object().shape({
  amount: yup.number().required('error-amount-required'),
});

const CustomBidProduct = ({
  data: { id, currentBid, multiplied },
}: {
  data: any;
}) => {
  const { t } = useTranslation('common');

  const { bidProduct, isLoading } = useBid(id);

  function onSubmit({ amount }: FormValues) {
    bidProduct({ product_id: id, amount: amount });
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-light p-5 sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-5 text-center text-sm font-semibold text-heading sm:mb-6">
        {t('text-custom-bid')}
      </h1>

      <small className="mb-2">Amount must be multiplied at {multiplied}</small>

      <Form<FormValues>
        onSubmit={onSubmit}
        validationSchema={customBidSchema}
        className="w-full"
        useFormProps={{
          defaultValues: {
            amount: currentBid + multiplied,
          },
        }}
      >
        {({ control, formState: { errors } }) => (
          <div className="flex flex-col">
            <div className="flex w-full items-center md:min-w-[360px]">
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    className="!flex !h-12 !w-full !appearance-none !items-center !rounded !border !border-border-base !p-0 !text-sm !text-heading !transition !duration-300 !ease-in-out focus:!border-accent focus:!outline-none focus:!ring-0 ltr:!rounded-r-none ltr:!border-r-0 ltr:!pr-4 ltr:!pl-14 rtl:!rounded-l-none rtl:!border-l-0 rtl:!pl-4 rtl:!pr-14"
                    {...field}
                  />
                )}
              />
              <Button
                className="!text-sm ltr:!rounded-l-none rtl:!rounded-r-none"
                loading={isLoading}
                disabled={isLoading}
              >
                {t('text-bid')}
              </Button>
            </div>
            {errors.amount?.message && (
              <p className="mt-2 text-xs text-red-500 ltr:text-left rtl:text-right">
                {t(errors.amount.message)}
              </p>
            )}
          </div>
        )}
      </Form>
    </div>
  );
};

export default CustomBidProduct;
