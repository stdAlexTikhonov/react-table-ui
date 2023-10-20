import React from 'react';

import { Positions } from '@components/Table/types';
import { flexRender, Row } from '@tanstack/react-table';

import { CellHandlers, VirtualBodyProps } from './types';

import styles from './Body.module.scss';

import { getVirtualItem } from '../Table/utilts';
import { VirtualPadding } from '../VirtualPadding';
import { getCellsMethod, getClassNames, getRowSpan } from './utils';
import { RangeSelection } from '../RangeSelection';
import { TableCell } from './TableCell';

import _get from 'lodash/get';

export const VirtualBody = ({
  table,
  state,
  tableHandlers,
  cellHandlers,
  rangeHandlers,
  paddingBottom,
  paddingTop,
  virtualRows,
  rowVirtualizer,
  virtualColumns,
  virtualPaddingLeft,
  virtualPaddingRight,
  position = Positions.CENTER
}: VirtualBodyProps) => {
  const { rowSelection, tablePosition = Positions.CENTER, compound } = table.getState();
  const { border = true, onSelectionChange, editable, rowColors } = _get(table, 'options.meta') || {};

  const handleClick = (row: Row<any>) => {
    table.setRowSelection(prev => prev[row.index] ? {} : { [row.index]: true });
    onSelectionChange?.(rowSelection[row.index] ? {} : { [row.index]: true });
  };

  const { enableRowSelection, enableMultiRowSelection } = table.options;
  const selection  = enableRowSelection || enableMultiRowSelection;

  const { rows } = table.getRowModel();

  const { firstRow, firstColumn, left } = state;

  return (
    <tbody
      {...(editable && tableHandlers)}
      className={styles.body}
      tabIndex={0}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`
      }}
    >
      <VirtualPadding.Row padding={paddingTop} />
      {virtualRows.map((virtualRow, rowIndex) => {
        const row = getVirtualItem(rows, virtualRow, true);


        const getCells = getCellsMethod(position, row);

        const columns = getCells();

        const cellHandlersModified: CellHandlers = {...cellHandlers, onMouseDown: e => cellHandlers.onMouseDown(e, position)}

        const className = getClassNames(row, virtualRow.index, Boolean(selection), rowColors);

        const rowCompounds = compound[virtualRow.index];

        return (
          <tr
            key={row.id}
            data-index={virtualRow.index}
            {...({ className })}
            {...(!enableMultiRowSelection && { onClick: () => handleClick(row) })}
          >
            <VirtualPadding.BodyCell padding={virtualPaddingLeft} />

            {virtualColumns.map((virtualCell, index) => {
             
              const { id, column, getContext } = getVirtualItem(columns, virtualCell, true);
              const rowSpan = getRowSpan(rowCompounds, column.id);
              const rowSpanCorrection = rowIndex === 0 && rowCompounds?.[column.id]?.virtualValue ? rowCompounds[column.id].virtualValue : rowSpan;

              const isActive =
                row.index === firstRow && firstColumn === index && tablePosition === position;

              return rowSpanCorrection? (
                <TableCell
                  key={id}
                  rowSpan={rowSpanCorrection}
                  column={column}
                  table={table}
                  index={index}
                  rowId={row.id}
                  active={isActive}
                  cellHandlers={cellHandlersModified}
                  border={index !== 0 && border}
                  lastRow={row.index === rows.length}
                >
                  {flexRender(column.columnDef.cell, getContext())}
                </TableCell>
              ) : null;
            })}
            <VirtualPadding.BodyCell padding={virtualPaddingRight} />
          </tr>
        );
      })}
      <VirtualPadding.Row padding={paddingBottom} />
      {left > -1 && position === tablePosition && (
        <RangeSelection rangeHandlers={rangeHandlers} state={state} />
      )}
    </tbody>
  );
};
