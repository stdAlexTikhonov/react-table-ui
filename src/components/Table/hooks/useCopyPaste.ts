// TODO: Refactoring this component – Alexander Tihonov
import { useReducer, useEffect } from 'react';

import { Column, Table } from '@tanstack/react-table';
import { VirtualItem } from '@tanstack/virtual-core';

import { Positions, Sizes } from '../types';
import { Actions, initialState, reducer } from './reducer';
import { range } from 'lodash';
import { getLevelIndexes, getRowData, horizontal, vertical } from '../utils';
import { useTableData } from './useTableData';

import _get  from 'lodash/get';

const checkValue = (current: number, step: number, length: number) => {
  const newValue = current + step;
  return newValue >= 0 && newValue < length ? newValue : current;
};

export const useCopyPaste = (
  table: Table<unknown>,
  virtualColumns?: VirtualItem[],
  virtualRows?: VirtualItem[]
) => {
  const { updateData, onPaste: onPasteLocal, updateCell, id, size } = _get(table, 'options.meta') || { size: Sizes.S };
  const CELL_HEIGHT = +(Sizes[size as Sizes] || Sizes.S);
  const { columnSizing, tablePosition = Positions.CENTER } = table.getState();
  
  const { order, columns, rows, positions, widths, basicRows } = useTableData(table, tablePosition, virtualColumns, virtualRows);

  const positionsReversed = positions.slice().reverse();

  type DisableMap = Record<string, ((table: Table<unknown>, rowId: string) => boolean) | undefined>;

  const disabled = columns.reduce(
    (acc: DisableMap, column: Column<unknown, unknown>) => ({
      ...acc,
      [column.id]: column.columnDef.meta?.disabled
    }),
    {}
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const reset = () => {
    dispatch({
      type: Actions.SET_FIRST_CELL,
      payload: {
        firstColumn: -1,
        firstColumnName: '',
        firstRow: -1
      }
    });
    dispatch({ type: Actions.RESET_CELL });
    dispatch({ type: Actions.RESET_COPIED });
    dispatch({ type: Actions.SET_ENTER });
    (document.activeElement as HTMLInputElement).blur?.();
  };

  useEffect(() => {
    reset();
  }, [columnSizing])

  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = '0px';
    textArea.style.left = '0px';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  };

  const onCopy = () => {
    dispatch({ type: Actions.SET_COPIED });
    const minCol =
      state.firstColumn < state.lastColumn
        ? state.firstColumn
        : state.lastColumn;
    const maxCol =
      state.firstColumn > state.lastColumn
        ? state.firstColumn
        : state.lastColumn;

    const minRow =
      state.firstRow < state.lastRow ? state.firstRow : state.lastRow;
    const maxRow =
      state.firstRow > state.lastRow ? state.firstRow : state.lastRow;

    const diff = maxCol - minCol;
    const firstColIndex = order.indexOf(state.firstColumnName);
    const lastColIndex = state.firstColumn < state.lastColumn ? firstColIndex + diff : firstColIndex - diff;

    const trueMin = Math.min(firstColIndex, lastColIndex);
    const trueMax = Math.max(firstColIndex, lastColIndex);

    const result = table
      .getRowModel()
      .rows.map((rowData, rowIndex) =>
        rowIndex >= minRow && rowIndex <= maxRow
          ? getRowData(rowData)[tablePosition as Positions]()
            .map(cell => cell.getValue() || ' ')
            .slice(trueMin, trueMax + 1)
            .join('\t')
          : null
      )
      .filter(item => item)
      .join('\r\n');

    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard
        .writeText(result)
        .then(() =>
          dispatch({ type: Actions.SET_SHOW_CONTEXT_MENU, payload: false })
        )
        .catch(err => {
          console.error('Something went wrong', err);
        });
    } else {
      unsecuredCopyToClipboard(result);
      dispatch({ type: Actions.SET_SHOW_CONTEXT_MENU, payload: false });
    }
  };

  const onPaste: React.ClipboardEventHandler<HTMLTableSectionElement> = (e) => {
    if (table.options.enableExpanding) return false;
    if ((e.target as HTMLInputElement).disabled) return false;

    navigator.clipboard
      .readText()
      .then(text => {
        const result = text
          .trim()
          .replace(/\r/g, '')
          .split('\n')
          .map(row => row.split('\t'));

        const firstColumnIndex = order.indexOf(state.firstColumnName);

        const columnsLength = result[0].length;
        const inputColumns = order.slice(
          firstColumnIndex,
          firstColumnIndex + columnsLength
        );

        dispatch({ type: Actions.RESET_COPIED });

        dispatch({
          type: Actions.SET_CELL,
          payload: {
            top: state.firstRow,
            left: state.firstColumn,
            bottom: state.firstRow + result.length,
            right: state.firstColumn + columnsLength,
            leftNew: state.positions[state.firstColumn] ?? 0,
            topNew: state.selectionTop[state.firstRow] ?? 0,
            widthNew: widths
              .slice(state.firstColumn, state.firstColumn + columnsLength)
              .reduce((a: number, b: number) => a + b, 0),
            height: result.length,
            heightNew: result.length * CELL_HEIGHT
          }
        });

        const transformed = result.map((row, rowIndex) =>
          row.reduce((prev: Record<string, string | number>, current: string | number, index: number) => {
            const isDisabled = disabled[`${inputColumns[index]}`];
            return isDisabled?.(table, `${rowIndex + state.firstRow}`)
              ? prev
              : {
                ...prev,
                [inputColumns[index]]: current,
                rowIndex: rowIndex + state.firstRow
              };
          }, {} as Record<string, string>)
        );

        if (updateData) {
          const lastRow = transformed.length + state.firstRow;
          const integrated = rows.map((row, index) =>
            index >= state.firstRow && index < lastRow
              ? { ...row as Record<string, unknown>, ...transformed[index - state.firstRow] }
              : row
          );

          updateData?.(integrated);
        }
        if (onPasteLocal) {
          const total = transformed.length + state.firstRow;
          if (total > rows.length) {
            const diff = total - rows.length;
            onPasteLocal(
              transformed.slice(0, transformed.length - diff)
            );
          } else onPasteLocal?.(transformed);
        }

        dispatch({ type: Actions.SET_SHOW_CONTEXT_MENU, payload: false });
      })
      .catch(err => {
        console.error('Something went wrong', err);
      });
  };

  const onContextMenu = (
    e: React.MouseEvent<HTMLTableSectionElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: Actions.SET_CONTEXT,
      payload: {
        contextLeft: e.pageX,
        contextTop: e.clientY,
        showContextMenu: true
      }
    });
  };

  const onMouseDown = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    position = Positions.CENTER
  ) => {
    const column = Number(e.currentTarget.dataset['column']);
    const columnName = e.currentTarget.dataset.columnName as string;
    const rowIndex = Number(e.currentTarget.dataset['row']);
    if (position !== tablePosition) reset();

    if (e.button === 0) {
      table.setState(prev => ({ ...prev, selectIsActive: false, tablePosition: position }));
      dispatch({ type: Actions.SET_SELECTION, payload: true });

    }

    if (column >= 0 && rowIndex >= 0) {
      dispatch({ type: Actions.RESET_CELL });

      dispatch({
        type: Actions.SET_POSITION,
        payload: {
          [column]: e.currentTarget.offsetLeft
        }
      });

      dispatch({
        type: Actions.SET_TOP_POSITION,
        payload: {
          [rowIndex]: e.currentTarget.offsetTop
        }
      });

      dispatch({
        type: Actions.SET_FIRST_CELL,
        payload: {
          firstColumn: column,
          firstColumnName: columnName,
          firstRow: rowIndex
        }
      });
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    const column = e.currentTarget.dataset['column'];
    const rowIndex = e.currentTarget.dataset['row'];
    if (e.button === 0) {
      dispatch({ type: Actions.SET_SELECTION, payload: false })
    }

    dispatch({
      type: Actions.SET_LAST_CELL,
      payload: {
        lastColumn: Number(column),
        lastRow: Number(rowIndex)
      }
    });
  };

  const onMouseMove = (
    e: React.MouseEvent<HTMLTableSectionElement, MouseEvent>
  ) => {
    if (state.selectionInProgress) {
      if (table.options.enableExpanding) return;
      if (state.copied) dispatch({ type: Actions.RESET_COPIED});
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = Math.floor(e.clientX - rect.left);

      const leftPosition = positionsReversed.find(
        (item: number) => item <= clientX
      ) as number;

      const x = positions.indexOf(leftPosition);
      const y = Math.floor((e.clientY - rect.top) / CELL_HEIGHT);
      const top = state.firstRow < y ? state.firstRow : y;
      const left = state.firstColumn < x ? state.firstColumn : x;
      const bottom = state.firstRow > y ? state.firstRow : y;
      const right = state.firstColumn > x ? state.firstColumn : x;
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const widthNew = widths.slice(left, right + 1).reduce((a: number, b: number) => a + b, 0);
      const height = bottom - top + 1;

      if (left === right && top === bottom) return;

      dispatch({
        type: Actions.SET_CELL,
        payload: {
          top,
          left,
          height,
          bottom,
          right,
          leftNew: state.positions[left] ?? positions[left],
          topNew: state.selectionTop[top] ?? top * CELL_HEIGHT,
          heightNew: height * CELL_HEIGHT,
          widthNew
        }
      });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    const code = (e.code ?? e.key).replace('Arrow', '');
    const VStep = vertical[code] ?? 0;
    const HStep = horizontal[code] ?? 0;
    const firstColumn = checkValue(state.firstColumn, HStep, columns.length);
    const firstRow = checkValue(state.firstRow, VStep, rows.length);
    
    // russian 'c' and english 'c'
    if ((e.key === 'c' || e.key === 'с') && (e.ctrlKey || e.metaKey)) {
      onCopy(); //e.metaKey for Mac, e.ctrlKey for Windows
    }

    if (code === 'Escape') {
      reset()
    } else if (code === 'Backspace' || code === 'Delete') {
      const startColumn = Math.min(state.firstColumn, state.lastColumn);
      const endColumn = Math.max(state.firstColumn, state.lastColumn);

      const diff = endColumn - startColumn;
      const firstColIndex = order.indexOf(state.firstColumnName);
      const lastColIndex = state.firstColumn < state.lastColumn ? firstColIndex + diff : firstColIndex - diff;

      const trueMin = Math.min(firstColIndex, lastColIndex);
      const trueMax = Math.max(firstColIndex, lastColIndex);

      const inputColumns = order.slice(
        trueMin,
        trueMax + 1
      );

      const startRow = Math.min(state.firstRow, state.lastRow);
      const endRow = Math.max(state.firstRow, state.lastRow) + 1;

      const rowIndexes = range(startRow, endRow);
      for (const rowIndex of rowIndexes) {
        for (const columnId of inputColumns) {
          const isDisabled = disabled[columnId]?.(table, rowIndex.toString());
          if (isDisabled) continue;

          const {rowIndex: index, parentIndex} = getLevelIndexes(basicRows[rowIndex])
          updateCell?.(
            index,
            columnId,
            '',
            parentIndex
          );
        }
      }

    } else if (code === 'Enter') {
      if (state.enterFlag) {
        dispatch({
          type: Actions.SET_FIRST_CELL,
          payload: {
            firstColumn,
            firstColumnName: '',
            firstRow
          }
        });
        const input = e.currentTarget as HTMLInputElement;
        input.focus({ preventScroll: true });
      } else {
        const input = document.querySelector(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `[data-id="${id}"] [data-row="${state.firstRow}"][data-column="${state.firstColumn}"] input`
        ) as HTMLInputElement;
        input.focus();
      }
      dispatch({ type: Actions.TOGGLE_ENTER });
    } else if ('Tab' === code || (e.code ?? e.key).includes('Arrow')) {
      dispatch({
        type: Actions.SET_FIRST_CELL,
        payload: {
          firstColumn,
          firstColumnName: '',
          firstRow
        }
      });

      const tbody = e.currentTarget as HTMLInputElement;
      tbody.focus();

      // TODO: вернуть scrollIntoView
      // const cell = document.querySelector(
      //   `[data-row="${firstRow}"][data-column="${firstColumn}"]`
      // ) as HTMLInputElement;
      // cell.scrollIntoView();

      dispatch({ type: Actions.RESET_ENTER });
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      const input = document.querySelector(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `[data-id="${id}"] [data-row="${firstRow}"][data-column="${firstColumn}"] input`
      ) as HTMLInputElement;
      
      if (!input.disabled) {
        input.focus();
        const {rowIndex: index, parentIndex} = getLevelIndexes(basicRows[firstRow])
        updateCell?.(
          index,
          order[firstColumn],
          input.value + e.key,
          parentIndex
        );
    
        dispatch({ type: Actions.SET_ENTER });
      }
    }
  };

  const onClick = (e: React.MouseEvent<HTMLTableSectionElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: Actions.SET_ENTER });
  };

  const onCloseMenu = () =>
    dispatch({ type: Actions.SET_SHOW_CONTEXT_MENU, payload: false });



  const onCellMove = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>
  ) => {
    if (state.selectionInProgress) {
      const column = Number(e.currentTarget.dataset['column']);
      const row = Number(e.currentTarget.dataset['row']);
      if (column <= state.firstColumn) {
        dispatch({
          type: Actions.SET_POSITION,
          payload: {
            [column]: e.currentTarget.offsetLeft
          }
        });
      }

      if (row <= state.firstRow) {
        dispatch({
          type: Actions.SET_TOP_POSITION,
          payload: {
            [row]: e.currentTarget.offsetTop
          }
        });
      }
    }
  };

  const onRangeMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 0) {
      table.setState(prev => ({...prev, selectIsActive: true }));
      dispatch({ type: Actions.SET_SELECTION, payload: false });
    }

    dispatch({
      type: Actions.SET_LAST_CELL,
      payload: {
        lastColumn: state.firstColumn === state.left ? state.right : state.left,
        lastRow: state.firstRow === state.top ? state.bottom : state.top
      }
    });
  };

  return {
    state,
    tableHandlers: {
      onCopy,
      onContextMenu,
      onKeyDown,
      onMouseMove,
      onClick,
      onPaste
    },
    onCloseMenu,
    cellHandlers: {
      onMouseUp,
      onMouseMove: onCellMove,
      onMouseDown
    },
    rangeHandlers: {
      onMouseUp: onRangeMouseUp
    }
  };
};
