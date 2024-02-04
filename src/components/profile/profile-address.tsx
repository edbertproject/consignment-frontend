import { useModalAction } from '@/components/ui/modal/modal.context';
import AddressCard from '@/components/address/address-card';
import { AddressHeader } from '@/components/address/address-header';
import { useTranslation } from 'next-i18next';
import { AddressType } from '@/framework/utils/constants';
import { Address } from '@/types';

interface AddressesProps {
  addresses: Address[] | undefined;
  label: string;
  className?: string;
  userId: string;
}

export const ProfileAddressGrid: React.FC<AddressesProps> = ({
  addresses,
  label,
  className,
  userId,
}) => {
  const { openModal } = useModalAction();
  const { t } = useTranslation('common');

  function onAdd() {
    openModal('ADD_OR_UPDATE_ADDRESS', {
      customerId: userId,
    });
  }

  function onEdit(address: any) {
    openModal('ADD_OR_UPDATE_ADDRESS', { customerId: userId, address });
  }
  function onDelete(address: any) {
    openModal('DELETE_ADDRESS', { customerId: userId, addressId: address?.id });
  }

  return (
    <div className={className}>
      <AddressHeader onAdd={onAdd} count={false} label={label} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {addresses?.map((address) => (
          <AddressCard
            checked={false}
            address={address}
            onDelete={() => onDelete(address)}
            onEdit={() => onEdit(address)}
            userId={userId}
            key={address.id}
          />
        ))}
        {!Boolean(addresses?.length) && (
          <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-left text-base">
            {t('text-no-address')}
          </span>
        )}
      </div>
    </div>
  );
};
export default ProfileAddressGrid;
