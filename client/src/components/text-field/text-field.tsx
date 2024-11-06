import React from 'react';

interface ITextFieldProps {
  readonly placeholder?: string;
  readonly label?: string;
  readonly onChange?: (value: string) => void;
  readonly type: string;
  readonly value: string;
}

const TextField = ({
  type,
  value,
  label,
  placeholder,
  onChange
}: ITextFieldProps) => (
  <div className="mb-4">
    <label htmlFor="text-field">{label}</label>
    <input
      className="mt-1 py-1 px-3 rounded-md w-full text-base border border-black-900"
      id="text-field"
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  </div>
);

export default TextField;
