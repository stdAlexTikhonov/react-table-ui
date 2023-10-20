import React, { useMemo, useReducer } from 'react';
import { Positions, Sizes } from '@components/Table/types';
import { VirtualHeaderProps } from './types';
import styles from './Header.module.scss';
import { getVirtualItem } from '../Table/utilts';
import { VirtualPadding } from '../VirtualPadding';
import { getHeaderGroupsMethod } from './utilts';
import { HeaderCell } from './HeaderCell';
import { HeaderGroup, Header } from '@tanstack/react-table';
import _get from 'lodash/get';
import { Actions, reducer } from './reducer';

type Headers = Header<unknown, unknown>[];

export const VirtualHeader = ({
  table,
  virtualColumns,
  virtualPaddingLeft,
  virtualPaddingRight,
  position = Positions.CENTER
}: VirtualHeaderProps) => {
  
  const getHeaderGroups = getHeaderGroupsMethod(position, table);
  const headerGroups = getHeaderGroups();
  const { isNumbers, size } = _get(table, 'options.meta') || {};

  const lastIndex = headerGroups.length - 1;

  const transformedHeaderGroups = useMemo(() => {
    if (headerGroups.length > 1) {
      const [lastGroup] = headerGroups.slice(-1);
      const topGroups = headerGroups.slice(0, -1);
      return topGroups.map((headerGroup: HeaderGroup<unknown>) => {
        const { headers } = headerGroup;
        return ({
          ...headerGroup,
          headers: headers
            .map((header, headerIndex) => Array.from({ length: header.colSpan }, (_, index) => index === 0
              ? header
              : ({
                id: `_${headerIndex}_${index}`,
                isPlaceholder: index > 0,
                column: {
                  id: `_${headerIndex}_${index}`
                }
              }) as Header<unknown, unknown>
            ))
            .reduce((a, b) => a.concat(b), [] as Headers)
        });
      }).concat([lastGroup])
    }
    else return headerGroups
  }, [headerGroups]);

  const initialState = table.getState().columnOrder.reduce((a,b) => ({...a, [b]: 'contains' }), {});

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFilterChange = (filter: Record<string, string>) => {
    dispatch({ type: Actions.SET_FILTER, payload: filter });
  }
  
  return (
    <thead className={styles.thead} style={{ top: lastIndex * Sizes[size ?? 'S'] }}>
      {transformedHeaderGroups.map((headerGroup, index) => 
        index === lastIndex ? (
          <tr
            key={headerGroup.id}
          >
            <VirtualPadding.HeaderCell padding={virtualPaddingLeft} />
            {virtualColumns.map(
              virtualHeader => {
                const header = getVirtualItem(headerGroup.headers,virtualHeader, true);
                return header.isPlaceholder
                  ? <th key={header.id} className={styles.cell} />
                  : <HeaderCell key={header.id} header={header} table={table} filterType={state[header.column.id]} onFilterChange={handleFilterChange}  isNumber={isNumbers?.[header.column.id] ?? false} virtual />;
              }
            )}
            <VirtualPadding.HeaderCell padding={virtualPaddingRight} />
          </tr>)
          : null)
      }
    </thead>
  );
};
