import React, { useRef, PropsWithChildren, useState, useEffect } from 'react';

import {
  IconClose24,
  IconSettings24
} from '@components/Icon/IconsList/24';

import { Button } from '@components/Button';

import styles from './Drawer.module.scss';
import clsx from 'clsx';
import { Table } from '@tanstack/react-table';
import { Dispatcher, Actions, State } from '../reducer';
import _get from 'lodash/get';

import { useTranslation } from 'react-i18next';

interface Props {
  table: Table<unknown>;
  state: State;
  dispatch: Dispatcher;
  onOpen: () => void;
}

const traverse = (node: string, mapping: Record<string, string[]>): string => {
  const nodes = mapping[node];
  return nodes.length > 0 ? node + ',' + nodes.map(item => traverse(item, mapping)).join(',') : node;
}

export const Drawer = ({ children, table, state, dispatch, onOpen }: PropsWithChildren<Props>) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const { id, zIndex } = _get(table, 'options.meta') || {};
  const [open, setOpen] = useState(false);
  const tableState = table.getState();
  const initVisibilityState = tableState.columnOrder.reduce((a,b) => {a[b] = true; return a; }, {} as Record<string, boolean>);
  const combined = { ...initVisibilityState, ...tableState.columnVisibility };
  const initPinningState = tableState.columnPinning;


  useEffect(() => {
    if (open) {
      dispatch({ type: Actions.SET_VISIBILITY, payload: combined });
      dispatch({ type: Actions.SET_PIN, payload: initPinningState });
      onOpen();
    }
  }, [open]);
  
  const handleAccept = () => {
    const base = traverse('root', state.columnOrder);
    const newColumnOrder = base.split(',');
    table.setColumnVisibility(state.columnVisibility);
    table.setColumnPinning(state.columnPinning);
    newColumnOrder.shift();
    table.setColumnOrder(newColumnOrder);
    ref.current?.click();
  };
  const handleCancel = () => {
    dispatch({ type: Actions.SET_VISIBILITY, payload: combined });
    dispatch({ type: Actions.SET_PIN, payload: initPinningState });
    dispatch({ type: Actions.RESET_ORDER });
    dispatch({ type: Actions.SET_FOUND_INDEX, payload: '' });
    ref.current?.click();
  };

  const handleToggle = () => {
    setOpen(prev => !prev);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const code = (e.code ?? e.key);
    if (code === 'Escape') handleCancel();
  }

  return (
    <div>
      <label className={styles['menu-open']} htmlFor={`${id!}drawer`}>
        <IconSettings24 color="primary" />
      </label>
      <input id={`${id!}drawer`} className={styles['menu-toggle']} type="checkbox" checked={open} ref={ref} onChange={handleToggle} />
      <div className={styles.shield} style={{ zIndex: zIndex ? zIndex + 1 : 3 }} onClick={handleCancel} />
      <div className={styles.drawer} style={{ zIndex: zIndex ? zIndex + 2 : 4 }} tabIndex={0} onKeyDown={handleKeyDown}>
        <label
          className={clsx(styles['menu-open'], styles.close)}
          htmlFor={`${id!}drawer`}
        >
          <IconClose24 />
        </label>
        <div className={styles.wrapper}>
          {children}
        </div>
        <div className={styles.controls}>
          <Button className={clsx(styles.control, styles.accept)} variant='primary' size='s' onClick={handleAccept}>{t('columnSettings.accept')}</Button>
          <Button className={styles.control} variant='secondary' size='s' onClick={handleCancel}>{t('columnSettings.cancel')}</Button>
        </div>
      </div>
    </div>
  );
};
