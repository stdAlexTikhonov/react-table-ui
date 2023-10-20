import React from 'react';
import { DebouncedInput } from '../DeboucedInput';
import _get from 'lodash/get';

import styles from './GlobalFilter.module.scss';
import { Props } from './types';
import { useTranslation } from 'react-i18next';


export const GlobalFilter = <T, >({ table }: Props<T>) => {
  const { t } = useTranslation();
  const { onGlobalFilterChange } = _get(table, 'options.meta') || {};

  const handleGlobalFilterChange = (value: string) => {
    if (onGlobalFilterChange) onGlobalFilterChange(value);
    else table.options.onGlobalFilterChange?.(value);
  }

  return <DebouncedInput
    value={table.getState().globalFilter ?? ''}
    onChange={handleGlobalFilterChange}
    placeholder={t('globalFilter.search')}
    className={styles.filter}
  />
}