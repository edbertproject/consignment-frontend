import Uploader from '@/components/ui/forms/uploader';
import { Controller } from 'react-hook-form';
import React from "react";

interface FileInputProps {
  control: any;
  label?: string;
  name: string;
  multiple?: boolean;
}

const FileInput = ({ control, name, multiple, label }: FileInputProps) => {
  return (
      <div>
        {label && (
            <label
                htmlFor={name}
                className="block mb-3 text-sm font-semibold leading-none text-body-dark"
            >
              {label}
            </label>
        )}
        <Controller
            control={control}
            name={name}
            defaultValue={[]}
            render={({ field: { ref, ...rest } }) => (
                <Uploader {...rest} multiple={multiple} />
            )}
        />
      </div>
  );
};

export default FileInput;
