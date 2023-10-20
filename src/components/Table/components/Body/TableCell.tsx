import { Column } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { Table } from '@tanstack/react-table';
import styles from './Body.module.scss';
import _get from 'lodash/get';
import { CellHandlers } from './types';
import { Sizes } from '@components/Table/types';

interface TDProps {
  table: Table<unknown>
  column: Column<unknown>,
  index: number,
  rowId: string,
  active: boolean;
  cellHandlers: CellHandlers
  lastRow: boolean;
  rowSpan: number;
  border?: boolean;
}

export const TableCell = ({ children, column, index, rowId, active, cellHandlers, border = true, table, lastRow, rowSpan  }: PropsWithChildren<TDProps>) => {
  const { editable, size } = _get(table, 'options.meta') || { size: Sizes.S };
  return <td
    data-index={index}
    style={{
      width: column.getSize()
    }}
    data-column-name={column.id}
    data-column={index}
    rowSpan={rowSpan}
    data-row={rowId}
    className={clsx(
      styles.cell,
      active && styles.controlled,
      border && styles.border
    )}
    {...(editable && cellHandlers)}
  >
    <div style={{ height: +Sizes[size as Sizes] * rowSpan}} className={clsx(styles.wrapper, !lastRow && styles.borderBottom )}>
      {children}
    </div>
  </td>
};
