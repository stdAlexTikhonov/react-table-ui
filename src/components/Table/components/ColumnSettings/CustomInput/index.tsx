import React, { useState, ChangeEventHandler, useEffect, forwardRef } from 'react';
import Input from '@components/Input';

import styles from './CustomInput.module.scss';
import { IconSearch24, IconClose24 } from '@components/Icon/IconsList/24';
import { Dispatcher, Actions, Title } from '../reducer';
import { useTranslation } from 'react-i18next';

interface Props {
  titles: Title[];
  dispatch: Dispatcher;
}

export const CustomInput = forwardRef<HTMLInputElement, Props>(({ titles, dispatch }, ref) => {
  const [filtered, setFiltered] = useState<Title[]>([]);
  const [value, setValue] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const isValueExists = value.length > 0;
    const newTitles = titles.filter(({ title}) => isValueExists && title.toLowerCase().includes(value.toLowerCase()))
    setFiltered(newTitles);
  }, [value])

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => setValue(e.target.value);

  const handleClick = (id: string) => {
    setValue('');
    dispatch({ type: Actions.SET_EXPAND_ALL, payload: true });
    dispatch({ type: Actions.SET_FOUND_INDEX, payload: id });
  }

  const resetSearch = () => setValue('');

  return <div className={styles.root}>
    <Input
      inputRef={ref}
      placeholder={t('columnSettings.search')}
      className={styles.inputStyle}
      icon={value.length > 0 ? <div onClick={resetSearch}><IconClose24 /></div> : <IconSearch24 color="secondary" />}
      value={value}
      onChange={handleChange}
    />
    <div className={styles.helper}>
      {filtered.map(item => <div className={styles.item} onClick={() => handleClick(item.id)}>{item.title}</div>)}
      {filtered.length === 0 && value.length > 0 && <div className={styles.item}>{t('columnSettings.noResults')}</div>}
    </div>
  </div>;
});

