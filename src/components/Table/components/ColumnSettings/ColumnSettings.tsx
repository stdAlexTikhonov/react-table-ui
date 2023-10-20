import React, { useEffect, useReducer, useRef } from 'react';
import { Column, Table } from '@tanstack/react-table';
import { Drawer } from './Drawer';
import { Actions, reducer } from './reducer';
import { CustomInput } from './CustomInput';
import { List } from './List';

import styles from './ColumnSettings.module.scss';
import { Props } from './types';

import _get from 'lodash/get';

export const ColumnSettings = <T,>(props: Props<T>) => {
  const table = props.table as Table<unknown>
  const ref = useRef<HTMLInputElement>(null);
  const columns = table.getAllFlatColumns();
  const headerGroups = table.getHeaderGroups();

  const { lang } = _get(table, 'options.meta') || {};

  const initOrder = table.getState().columnOrder;

  const columnsMap = columns.reduce((accumulator, column) => {
    accumulator[column.id] = { ...column, columns: column.columns.sort((a, b) => initOrder.indexOf(a.id) - initOrder.indexOf(b.id)) }
    return accumulator;
  }, {} as Record<string, Column<unknown, unknown>>);
  const titles = columns
    .map(({ columnDef: { header, meta }, id }) => ({
      title: (typeof header === 'string' ? header : meta?.title ?? id),
      id
    }));

  const columnsx = initOrder.reduce((accumulator, column) => {
    accumulator[column] = columnsMap[column].columns.map(item => item.id);
    return accumulator;
  }, {} as Record<string, string[]>);

  const localInitOrder = { 'root': headerGroups[0].headers.map(header => header.column.id), ...columnsx };

  const initialState = {
    columnVisibility: initOrder.reduce((a,b) => { a[b] = true; return a; }, {} as Record<string, boolean>),
    columnPinning: { left: ['select'], right: [] },
    columnOrder: { 'root': headerGroups[0].headers.map(header => header.column.id), ...columnsx },
    initOrder: localInitOrder,
    columnsMap,
    titles,
    foundIndex: '',
    expandAll: false,
    levelsLen: headerGroups.length - 1
  };
  
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: Actions.RESET, payload: initialState });
  }, [initOrder.length]);

  useEffect(() => {
    dispatch({ type: Actions.SET_TITLES, payload: titles });
  }, [lang]);

  const handleOpen = () => {
    const initOrder = state.columnOrder;
    dispatch({ type: Actions.SET_INIT_ORDER, payload: initOrder });
    dispatch({ type: Actions.SET_COLUMN_MAP, payload: columnsMap });
    ref.current?.focus();
  }

  return (
    <Drawer table={table} state={state} dispatch={dispatch} onOpen={handleOpen}>
      <CustomInput titles={state.titles} dispatch={dispatch} ref={ref} />
      <div className={styles.wrapper}>
        <List dispatch={dispatch} state={state} droppableId='root' />
      </div>
    </Drawer>
  );
};
