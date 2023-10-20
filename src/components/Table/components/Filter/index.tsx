import React, { useMemo, useEffect, useState, useRef } from 'react';
import { DebouncedInput } from '../DeboucedInput';
import { Props } from './types';
import styles from './Filter.module.scss';
import { Dropdown } from './Dropdown';
import { MultipleSelect } from './MultipleSelect';
import { FilterFnOption } from '@tanstack/react-table';
import { IconClose16 } from '@components/Icon/IconsList/16'
import ClickAwayListener from '@components/ClickAwayListener';
import _get from 'lodash/get';
import { useTranslation } from 'react-i18next';
import { Sizes } from '@components/Table/types';
import clsx from 'clsx';


export const Filter = ({ column, table, onInnerFilterChange, filterType, focused, setFocused, borderBottom }: Props) => {
  const { onFilterChange, loadUniqueValues, size } = _get(table, 'options.meta') || {};
  const ref = useRef<number>(0);
  const [_value, setValue] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loadedValues, setLoadedValues] = useState<Array<string | number | null>>([]);
  const { t } = useTranslation();
  const state = table.getState();
  
  useEffect(() => {
    if (ref.current === 0) {
      const filter = state.columnFilters.find(item => item.id === column.id);
      if (filter) {
        const value = filter.value as string;
        setValue(value as string);
        setSelected(value.split(','));
        setLoadedValues(value.split(','));
      }
    } else {
      column.setFilterValue('');
      setValue('');
      setSelected([]);
      setLoadedValues([]);
    }
    return () => { ref.current = 1 }
  }, [filterType]);

  const isMultiple = filterType === 'multipleChoice';

  const sortedUniqueValues = useMemo(
    () => {
      const uniqueValues = column.getFacetedUniqueValues();
      const frontValues = uniqueValues ? Array.from(uniqueValues.keys()) : [];
      const values = onFilterChange ? loadedValues : frontValues;
      return values.sort().map(item => item?.toString() ?? '')
    },
    [column.getFacetedUniqueValues(), loadedValues]
  );

  const handleFocus = () => {
    if (column.columnDef.filterFn === 'auto') column.columnDef.filterFn = 'contains' as FilterFnOption<unknown>;
    void loadUniqueValues?.(column.id).then(data => setLoadedValues(data));
    setFocused(true);
  }

  const handleCancelClick = () => {
    setValue('');
    setFocused(false);
    if (onFilterChange) {
      onFilterChange({ id: column.id, mode: filterType, value: '' });
    } else column.setFilterValue('');
  }

  const handleChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange({ id: column.id, mode: filterType, value });
    } else {
      if (!isMultiple) column.setFilterValue(value);
    }
    setValue(value);

  }

  const handleMultChange = (values: string[]) => {
    setSelected(values);
    const result = values.join(',');
    if (onFilterChange) {
      onFilterChange({ id: column.id, mode: filterType, value: result })
    } else column.setFilterValue(result);
  }

  return <ClickAwayListener onClickAway={() => setFocused(false)}>
    <div
      className={clsx(styles.wrapper, focused && styles.focused, borderBottom && styles.borderBottom)}
      style={{ height: Sizes[size ?? 'S']}}
    >
      {_value && <div className={styles.underline} />}
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: string) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <Dropdown column={column} mode={filterType} maxHeight={state.baseHeight} onFilterChange={onInnerFilterChange} size={size} />
      {
        isMultiple 
          ? <MultipleSelect
            list={sortedUniqueValues}
            selected={selected}
            onChange={handleMultChange}
            onFocus={handleFocus}
            maxHeight={state.baseHeight}
            disabled={!column.getCanFilter()}
          />
          : <>
            <DebouncedInput
              onFocus={handleFocus}
              type="text"
              disabled={!column.getCanFilter()}
              value={(_value ?? '') as string}
              onChange={handleChange}
              placeholder={t('filters.search')}
              list={`${column.id}list`}
            />
            {focused && <div className={styles.clearIcon} style={{ height: Sizes[size ?? 'S']}} onClick={handleCancelClick} >
              <IconClose16 />
            </div>}
          </>
      }

    </div>
  </ClickAwayListener>
};
