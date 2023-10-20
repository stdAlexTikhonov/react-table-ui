import React, { useReducer } from 'react';
import { Actions, reducer } from './reducer';
import { Positions } from '@components/Table/types';
import { HeaderProps } from './types';
import styles from './Header.module.scss';
import { getHeaderGroupsMethod } from './utilts';
import { HeaderCell } from './HeaderCell';
import _get from 'lodash/get';

export const Header = ({
  table,
  position = Positions.CENTER
}: HeaderProps) => {
  
  const getHeaderGroups = getHeaderGroupsMethod(position, table);
  const headerGroups = getHeaderGroups();
  const { isNumbers, enableRowVirtualization } = _get(table, 'options.meta') || {};

  const initialState = table.getState().columnOrder.reduce((a,b) => ({...a, [b]: 'contains' }), {});
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFilterChange = (filter: Record<string, string>) => {
    dispatch({ type: Actions.SET_FILTER, payload: filter });
  }

  return (
    <thead className={styles.thead}>
      {headerGroups.map((headerGroup) => (
        <tr
          key={headerGroup.id}
        >
          {headerGroup.headers.length === 1 && enableRowVirtualization && <th />}
          {headerGroup.headers.map(
            header => <HeaderCell key={header.id} header={header} table={table} filterType={state[header.column.id]} onFilterChange={handleFilterChange} isNumber={isNumbers?.[header.column.id] ?? false} />
          )}
        </tr>
      ))}
    </thead>
  );
};
