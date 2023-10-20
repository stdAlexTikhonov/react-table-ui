import React, { useState } from 'react';
import { IconContainer } from '@components/Icon/subcomponent/IconContainer';
import styles from './Filter.module.scss';
import { filterFns, filtersObj } from './utils';
import { IconContains24, IconDone24 } from '@components/Icon/IconsList/24';

import clsx from 'clsx';
import ClickAwayListener from '@components/ClickAwayListener';
import { useTranslation } from 'react-i18next';
import { Column, FilterFnOption } from '@tanstack/react-table';
import { Sizes } from '@components/Table/types';


interface Props {
    column: Column<any, unknown>;
    mode: string;
    maxHeight: number;
    onFilterChange: (filter: Record<string, string>) => void;
    size?: keyof typeof Sizes,
}

export const Dropdown = ({  column, mode, maxHeight, onFilterChange, size }: Props) => {
  const { id } = column;
  const disabled = !column.getCanFilter();
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const { t } = useTranslation();
  
  const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!disabled) {
      const box = e.currentTarget.getBoundingClientRect();
      setLeft(box.left);
      setTop(box.bottom);
      setOpen(true);
    }
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleClick = (value: string) => {
    onFilterChange({ [id]: value });
    column.columnDef.filterFn = value as FilterFnOption<unknown>;
  }

  const Filter = filtersObj[mode];

  return <div className={clsx(styles.dropdown, styles[`padding${size ?? 'S'}`])} onClick={handleOpen} onKeyDown={handleClose} tabIndex={1}>
    <IconContainer containerSize={32}>
      {Filter?.Icon ? <Filter.Icon {...(disabled && { color: 'disabled'})} /> : <IconContains24 {...(disabled && { color: 'disabled'})} />}
    </IconContainer>
    {open && <ClickAwayListener onClickAway={handleClose}>
      <div className={styles.menu} style={{ top, left, maxHeight }}>
        {filterFns.map(({ Icon, value}) =>
          <div key={value} className={clsx(styles.item, mode === value && styles.selected)} onClick={() => handleClick(value)}>
            <div className={styles.icon}>
              <Icon />
            </div>
            <span className={styles.title}>{t(`filters.${value}`)}</span>
            {mode === value && <IconContainer containerSize={24}>
              <IconDone24 color='primary'/>
            </IconContainer>}
          </div>)}
      </div>
    </ClickAwayListener>}
  </div>
}