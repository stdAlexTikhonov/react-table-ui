import React, { useState } from 'react';
import styles from './Filter.module.scss';

import ClickAwayListener from '@components/ClickAwayListener';
import Checkbox from '@components/Checkbox';
import { DebouncedInput } from '../DeboucedInput';
import Badge from '@components/Badge';
import { sizesMapping } from '@components/declaration';
import { useTranslation } from 'react-i18next';

interface Props {
  list: string[];
  selected: string[];
  onChange: (res: string[]) => void; 
  onFocus: () => void;
  maxHeight: number;
  disabled: boolean;
}

export const MultipleSelect = ({ list, selected, onChange, onFocus, maxHeight, disabled }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [value, setValue] = useState<string>('');

  const filtered = list.filter(item => item.includes(value));

  const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const box = e.currentTarget.getBoundingClientRect();
    setLeft(box.left);
    setTop(box.bottom);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleChange = (value: string) => {
    if (selected.includes(value)) onChange(selected.filter(item => item !== value));
    else onChange(selected.concat([value]));
  }

  const handleValueChange = (value: string) => {
    setValue(value);
  }

  return <>
    <DebouncedInput value={value} onChange={handleValueChange} placeholder={t('filters.search')} disabled={disabled} onFocus={onFocus} onClick={handleOpen} />
    <Badge size={sizesMapping.s} className={styles.badge}>{selected.length.toString()}</Badge>
    {open && <ClickAwayListener onClickAway={handleClose}>
      <div className={styles.menu} style={{ top, left, maxHeight }}>
        {filtered.map((item) =>
          <div key={item} className={styles.item}>
            <Checkbox checked={selected.includes(item)} onChange={() => handleChange(item)} />
            <span onClick={() => handleChange(item)} className={styles.title}>{item}</span>
          </div>)}
      </div>
    </ClickAwayListener>}
  </>
}