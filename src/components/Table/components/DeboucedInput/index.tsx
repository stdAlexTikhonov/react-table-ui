import React, { useEffect, useState } from 'react';
import { Props } from './types';
import clsx from 'clsx';
import styles from './DeboucedInput.module.scss';

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  className = '',
  ...props
}: Props) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      className={clsx(styles.input, className)}
      onChange={e => setValue(e.target.value)}
    />
  );
};
