import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import Alert from '@/components/ui/alert';
import CashOnDelivery from '@/components/checkout/payment/cash-on-delivery';
import { useAtom } from 'jotai';
import { paymentGatewayAtom } from '@/store/checkout';
import cn from 'classnames';
import { useSettings } from '@/framework/settings';
import { PaymentGateway } from '@/types';
import PaymentOnline from '@/components/checkout/payment/payment-online';
import Image from 'next/image';

interface PaymentMethodInformation {
  name: string;
  value: PaymentGateway;
  icon: string;
  component: React.FunctionComponent;
}

interface PaymentGroupOptionProps {
  payment: PaymentMethodInformation;
  theme?: string;
}

const PaymentGroupOption: React.FC<PaymentGroupOptionProps> = ({
  payment: { name, value, icon },
  theme,
}) => (
  <RadioGroup.Option value={value} key={value}>
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
        {icon ? (
          <>
            <Image
              src={icon}
              alt={name}
              className="h-[30px]"
              width={63}
              height={30}
            />
          </>
        ) : (
          <span className="text-xs font-semibold text-heading">{name}</span>
        )}
      </div>
    )}
  </RadioGroup.Option>
);

const PaymentGrid: React.FC<{ className?: string; theme?: 'bw' }> = ({
  className,
  theme,
}) => {
  const [gateway, setGateway] = useAtom(paymentGatewayAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation('common');
  const { settings, isLoading } = useSettings();
  // If no payment gateway is set and cash on delivery also disable then cash on delivery will be on by default
  const isEnableCashOnDelivery =
    (!settings?.useCashOnDelivery && !settings?.paymentGateway) ||
    settings?.useCashOnDelivery;

  // FixME
  // @ts-ignore
  const AVAILABLE_PAYMENT_METHODS_MAP: PaymentMethodInformation[] = [
    {
      name: "BCA",
      value: PaymentGateway.COD,
      icon: '',
      component: CashOnDelivery,
    },
    {
      name: "Mandiri",
      value: PaymentGateway.STRIPE,
      icon: '',
      component: CashOnDelivery,
    },
    {
      name: "BRI",
      value: PaymentGateway.RAZORPAY,
      icon: '',
      component: CashOnDelivery,
    },
  ];

  useEffect(() => {
    if (settings?.paymentGateway) {
      setGateway(settings?.paymentGateway?.toUpperCase() as PaymentGateway);
    } else {
      setGateway(PaymentGateway.COD);
    }
  }, [isLoading, settings?.useCashOnDelivery, settings?.paymentGateway]);
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

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {
            AVAILABLE_PAYMENT_METHODS_MAP.map((element, index) => {
              return (
                  <PaymentGroupOption
                      key={index}
                      theme={theme}
                      payment={element}
                  />
              )
            })
          }
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentGrid;
