import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import { useAtom } from 'jotai';
import cn from 'classnames';
import { PaymentMethod } from '@/types';
import { usePaymentMethods } from '@/framework/order';
import { paymentMethodAtom } from '@/store/checkout';

interface PaymentGroupOptionProps {
  payment: PaymentMethod;
  theme?: string;
}

const PaymentGroupOption: React.FC<PaymentGroupOptionProps> = ({
  payment,
  theme,
}) => (
  <RadioGroup.Option value={payment.id} key={payment.id}>
    {({ checked }) => (
      <div
        className={cn(
          'relative flex h-full w-full cursor-pointer items-center justify-center rounded border border-gray-200 bg-light py-3 text-center',
          checked && '!border-accent bg-light shadow-600',
          {
            '!border-gray-800 bg-light shadow-600': theme === 'bw' && checked,
          }
        )}
      >
        <span className="text-xs font-semibold text-heading">
          {payment.code}
        </span>
      </div>
    )}
  </RadioGroup.Option>
);

const PaymentGrid: React.FC<{ className?: string; theme?: 'bw' }> = ({
  className,
  theme,
}) => {
  const [gateway, setGateway] = useAtom(paymentMethodAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation('common');

  const { paymentMethods, isLoading } = usePaymentMethods();

  return (
    <div className={className}>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}

      <RadioGroup value={gateway} onChange={setGateway}>
        <RadioGroup.Label className="mb-5 block text-base font-semibold text-heading">
          {t('text-choose-payment')}
        </RadioGroup.Label>

        {isLoading && <small>Getting payment method...</small>}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {paymentMethods.map((element, index) => {
            return (
              <PaymentGroupOption key={index} theme={theme} payment={element} />
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentGrid;
