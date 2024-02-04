import { useTranslation } from 'next-i18next';
import { useRegisterPartner, useUser } from '@/framework/user';
import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import AddressCard from '@/components/address/address-card';
import { Address } from '@/types';
import { toast } from 'react-toastify';
import Button from '@/components/ui/button';

const PartnerFormModal = () => {
  const { t } = useTranslation('common');
  const { me } = useUser();
  const [selectedAddress, setAddress] = useState<Address>();
  const { mutate, isLoading } = useRegisterPartner();

  const handleSubmit = () => {
    if (selectedAddress?.id) {
      mutate({
        user_address_id: selectedAddress?.id,
      });
    } else {
      toast.error('Please select address');
    }
  };

  if (!me) return null;

  return (
    <div className="w-[95vw] max-w-2xl rounded-md bg-white p-8">
      <h3 className="mb-10 text-center text-2xl font-semibold text-heading">
        Choose address as a seller
      </h3>

      <div>
        {!me.addresses?.length ? (
          <div className="grid grid-cols-1 gap-4">
            <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
              {t('text-no-address')}
            </span>
          </div>
        ) : (
          <RadioGroup value={selectedAddress} onChange={setAddress}>
            <RadioGroup.Label className="sr-only">
              {t('text-shipping-address')}
            </RadioGroup.Label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {me.addresses?.map((address) => (
                <RadioGroup.Option value={address} key={address?.id}>
                  {({ checked }: { checked: boolean }) => (
                    <AddressCard checked={checked} address={address} />
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="big" loading={isLoading}>
          {t('text-register')}
        </Button>
      </div>
    </div>
  );
};

export default PartnerFormModal;
