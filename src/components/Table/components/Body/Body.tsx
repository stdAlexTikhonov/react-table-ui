import React from 'react';

import { Positions } from '@components/Table/types';
import { flexRender, Row } from '@tanstack/react-table';

import { BodyProps, CellHandlers } from './types';

import styles from './Body.module.scss';

import { getCellsMethod, getClassNames, getRowSpan } from './utils';
import { RangeSelection } from '../RangeSelection';
import { TableCell } from './TableCell';

import _get from 'lodash/get';

export const Body = ({
  table,
  state,
  tableHandlers,
  cellHandlers,
  rangeHandlers,
  position = Positions.CENTER
}: BodyProps) => {
  const { rowSelection,  tablePosition = Positions.CENTER, compound } = table.getState();
  
  const { border = true, onSelectionChange, editable, rowColors } = _get(table, 'options.meta') || {};

  const handleClick = (row: Row<unknown>) => {
    table.setRowSelection(prev => prev[row.index] ? {} : { [row.index]: true });
    onSelectionChange?.(rowSelection[row.index] ? {} : { [row.index]: true });
  };

  const { enableRowSelection, enableMultiRowSelection } = table.options;
  const selection  = enableRowSelection || enableMultiRowSelection;
  const { rows } = table.getRowModel();
  const { firstRow, firstColumn, left } = state;

  const celHandlersModified: CellHandlers = {...cellHandlers, onMouseDown: e => cellHandlers.onMouseDown(e, position)}

  return (
    <tbody
      {...(editable && tableHandlers)}
      className={styles.body}
      tabIndex={0}
      style={{
        height: 'inherit'
      }}
    >
      {rows.map((row, rowIndex) => {
      
        const getCells = getCellsMethod(position, row);
        const cells = getCells();
        const className = getClassNames(row, rowIndex, Boolean(selection), rowColors);
        const rowCompounds = compound[rowIndex];

        return (
          <tr
            key={row.id}
            data-index={rowIndex}
            {...({ className })}
            {...(!enableMultiRowSelection && { onClick: () => handleClick(row) })}
          >
            {cells.map((cell, index) => {
              const { id, column, getContext } = cell;

              const rowSpan = getRowSpan(rowCompounds, column.id);

              const isActive =
                rowIndex === firstRow && firstColumn === index && tablePosition === position;

              return rowSpan ? (
                <TableCell
                  key={id}
                  rowSpan={rowSpan}
                  column={column}
                  table={table}
                  index={index}
                  rowId={rowIndex.toString()}
                  active={isActive}
                  cellHandlers={celHandlersModified}
                  border={index !== 0 && border}
                  lastRow={rowIndex === rows.length - 1}
                >
                  {flexRender(column.columnDef.cell, getContext())}
                </TableCell>
              ) : null;
            })}
          </tr>
        );
      })}
      {left > -1 && position === tablePosition && (
        <RangeSelection rangeHandlers={rangeHandlers} state={state} />
      )}
    </tbody>
  );
};
