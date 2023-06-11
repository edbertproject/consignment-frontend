import Scrollbar from '@/components/ui/scrollbar';
import Select from '@/components/ui/select/select';
import { RadioGroup } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsRTL } from '@/lib/locals';
import { ProductType } from '@/types';
interface TypeOption {
  label: string;
  value: ProductType;
}
const types: TypeOption[] = [
  {
    label: 'Auction',
    value: 'Auction',
  },
  {
    label: 'Consign',
    value: 'Consign',
  },
];

const TypeFilter: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { isRTL } = useIsRTL();
  const [selected, setSelected] = useState(
    () => types.find((type) => type.value === router.query.type) ?? types[0]
  );

  useEffect(() => {
    if (!router.query.type) {
      setSelected(types[0]);
    }
  }, [router.query.type]);

  function handleChange(values: TypeOption) {
    const { value } = values;
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        type: value,
      },
    });
    setSelected(values);
  }

  return (
    <>
      <Scrollbar style={{ maxHeight: '400px' }}>
        <RadioGroup value={selected} onChange={handleChange}>
          <RadioGroup.Label className="sr-only">
            {t('text-type')}
          </RadioGroup.Label>
          <div className="space-y-4">
            {types.map((type) => (
              <RadioGroup.Option key={type.value} value={type}>
                {({ checked }) => (
                  <>
                    <div className="flex w-full cursor-pointer items-center">
                      <span
                        className={`h-[18px] w-[18px] rounded-full bg-white ltr:mr-3 rtl:ml-3 ${
                          checked
                            ? 'border-[5px] border-gray-800'
                            : 'border border-gray-600'
                        }`}
                      />
                      <RadioGroup.Label as="p" className="text-sm text-body">
                        {type.label}
                      </RadioGroup.Label>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </Scrollbar>
    </>
  );
};

export default TypeFilter;
