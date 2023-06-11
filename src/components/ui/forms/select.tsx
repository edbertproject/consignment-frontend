import React from 'react';
import { Props as ReactSelectProps } from 'react-select';
import Select from '@/components/ui/select/select';

export interface Props extends ReactSelectProps {
  className?: string;
  label?: string;
  name: string;
  error?: string;
}

const SelectForm = React.forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const { className, label, name, error, ...rest } = props;
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="mb-3 block text-sm font-semibold leading-none text-body-dark"
        >
          {label}
        </label>
      )}
      <Select className="w-full" id={name} name={name} ref={ref} {...rest} />
      {error && <p className="my-2 text-xs text-red-500">{error}</p>}
    </div>
  );
});
SelectForm.displayName = 'SelectForm';
export default SelectForm;
