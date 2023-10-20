import React from 'react';

import { Positions, Sizes } from '@components/Table/types';
import { flexRender, Row } from '@tanstack/react-table';

import { CellHandlers, VerticalVirtualBodyProps } from './types';

import styles from './Body.module.scss';

import { getCellsMethod, getClassNames, getRowSpan } from './utils';
import { VirtualPadding } from '../VirtualPadding';
import { getVirtualItem } from '../Table/utilts';
import { RangeSelection } from '../RangeSelection';
import { TableCell } from './TableCell';

import _get from 'lodash/get';

export const VerticalVirtualBody = ({
  table,
  state,
  tableHandlers,
  cellHandlers,
  rangeHandlers,
  paddingBottom,
  paddingTop,
  virtualRows,
  rowVirtualizer,
  position = Positions.CENTER
}: VerticalVirtualBodyProps) => {

  const { rowSelection, tablePosition = Positions.CENTER, compound } = table.getState();

  const { border = true, onSelectionChange, editable, rowColors, size = Sizes.S } = _get(table, 'options.meta') || {};

  const handleClick = (row: Row<any>) => {
    table.setRowSelection(prev => prev[row.index] ? {} : { [row.index]: true });
    onSelectionChange?.(rowSelection[row.index] ? {} : { [row.index]: true });
  };

  const { enableRowSelection, enableMultiRowSelection } = table.options;
  const selection  = enableRowSelection || enableMultiRowSelection;

  const { rows } = table.getRowModel();

  const { firstRow, firstColumn, left } = state;

  const cellHandlersModified: CellHandlers = {...cellHandlers, onMouseDown: e => cellHandlers.onMouseDown(e, position)}

  return (
    <tbody
      {...(editable && tableHandlers)}
      className={styles.body}
      suppressContentEditableWarning
      contentEditable={!navigator.clipboard}
      tabIndex={0}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`
      }}
    >
      <VirtualPadding.Row padding={paddingTop} />
      {virtualRows.map((virtualRow, rowIndex) => {
        const row = getVirtualItem(rows, virtualRow, true);
      
        const getCells = getCellsMethod(position, row);

        const cells = getCells();

        const className = getClassNames(row, row.index, Boolean(selection), rowColors);

        const rowCompounds = compound[virtualRow.index];

        return (
          <tr
            key={row.id}
            data-index={row.index}
            {...({ className })}
            {...(!enableMultiRowSelection && { onClick: () => handleClick(row) })}
          >
            {cells.length === 1 && <td className={styles.cell}><div style={{ height: +Sizes[size as Sizes] }} /></td>}
            {cells.map((cell, index) => {

              const { column, id, getContext } = cell;
              const rowSpan = getRowSpan(rowCompounds, column.id);
              const rowSpanCorrection = rowIndex === 0 && rowCompounds?.[column.id]?.virtualValue ? rowCompounds[column.id].virtualValue : rowSpan;
              
              const isActive =
                row.index === firstRow && firstColumn === index && tablePosition === position;

              return rowSpanCorrection ? (
                <TableCell
                  key={id}
                  column={column}
                  index={index}
                  rowSpan={rowSpanCorrection}
                  table={table}
                  rowId={row.id}
                  active={isActive}
                  cellHandlers={cellHandlersModified}
                  border={index !== 0 && border}
                  lastRow={row.index === rows.length - 1}
                >
                  {flexRender(column.columnDef.cell, getContext())}
                </TableCell>
              ) : null;
            })}
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
