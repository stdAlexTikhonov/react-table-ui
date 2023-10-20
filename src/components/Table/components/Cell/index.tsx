import React, { useEffect, useMemo, useState, CSSProperties } from 'react';

import { getLevelIndexes } from '../../utils';
import clsx from 'clsx';
import _get from 'lodash/get';

import { CellProps } from './types';

import styles from './Cell.module.scss';
import { Types, Sizes } from '@components/Table/types';

const getClassName = (size: Sizes) => {
  switch (size) {
    case Sizes.S:
      return styles.disabledCellS;
    case Sizes.M:
      return styles.disabledCellM;
    case Sizes.L:
      return styles.disabledCellL
  }
}

const classNameTypeMap: Record<Types, string> = {
  [Types.SUCCESS]: styles.success,
  [Types.SUCCESS_LIGHT]: styles.success_light,
  [Types.WARNING]: styles.warning,
  [Types.WARNING_LIGHT]: styles.warning_light,
  [Types.ERROR]: styles.error,
  [Types.ERROR_LIGHT]: styles.error_light,
  [Types.DISABLED]: styles.disabled
}

export function Cell<T>({
  getValue,
  row,
  column,
  table,
  type
}: CellProps<T>) {
  const { id: rowId } = row;
  const isDisabled = column.columnDef.meta?.disabled?.(table, rowId);

  const { enableExpanding } = _get(table, 'options') || {};
  const { selectIsActive } = table.getState();


  const { formatNumericValue, updateCell, editable, size } = _get(table, 'options.meta') || { size: Sizes.S };

  const keys = useMemo(() => {
    const defaultKeys = ['Enter', 'Escape', 'Tab'];
    if (!selectIsActive) return defaultKeys;
    return [...defaultKeys, 'Backspace', 'Delete'];
  }, [selectIsActive]);

  const className = getClassName(size as Sizes);

  const initialValue = getValue();

  const parsed =
    typeof initialValue === 'number'
      ? initialValue
      : parseFloat(initialValue as string);
  const isNumber = !isNaN(parsed);

  const [_value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  const onBlur = () => {
    setFocused(false);
    const { rowIndex, parentIndex } = getLevelIndexes(row);
    updateCell?.(rowIndex, column.id, _value, parentIndex);
    setValue(_value);
  };

  useEffect(() => {
    if (initialValue === null) setValue('');
    else {
      const parsed = parseFloat(initialValue as string);
      const isNumber = !isNaN(parsed);
      setValue(
        isNumber && !focused
          ? formatNumericValue?.(parsed) ?? initialValue
          : initialValue
      );
    }
  }, [initialValue, focused]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setValue(value);
  };

  const disabled = isDisabled || !editable;

  return (
    <>
      {disabled && <div className={className} />}
      <input
        value={_value as string}
        onChange={handleChange}
        onKeyDown={e => !keys.includes(e.code ?? e.key) && e.stopPropagation()}
        disabled={disabled}
        onBlur={onBlur}
        onFocus={() => setFocused(true)}
        onPaste={e => {
          if (!enableExpanding) {
            e.preventDefault();
          }
        }}
        style={{
          textAlign: column.columnDef.meta?.textAlign as CSSProperties['textAlign']
        }}
        className={clsx(
          styles.input,
          type && classNameTypeMap[type],
          isNumber && styles.number
        )}
      />
    </>
  );
}
