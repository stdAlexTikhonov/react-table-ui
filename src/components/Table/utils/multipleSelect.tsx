import React from 'react';
import Checkbox from '@components/Checkbox';
import { ColumnDef } from '@tanstack/react-table';

export function getMultipleSelect<T>(): ColumnDef<T, unknown> {
  return {
    id: 'select',
    size: 32,
    header: ({
      table: {
        getIsAllRowsSelected,
        getIsSomeRowsSelected,
        getToggleAllRowsSelectedHandler,
        options
      }
    }) => {

      return (
        <Checkbox
          {...{
            checked: getIsAllRowsSelected() || getIsSomeRowsSelected(),
            multiple: getIsSomeRowsSelected(),
            onChange: (e) => {
              options.meta?.onSelectionChange?.({ ['all']: !(getIsAllRowsSelected() || getIsSomeRowsSelected()) })
              getToggleAllRowsSelectedHandler()(e)
            }
          }}
        />
      )
    },
    cell: ({ row: { getIsSelected, getToggleSelectedHandler, index }, table }) => (
      <Checkbox
        {...{
          checked: getIsSelected(),
          onChange: (e) => {
            const tableState = table.getState();
            table.options.meta?.onSelectionChange?.({ ...tableState.rowSelection, [index]: !tableState.rowSelection[index] });
            getToggleSelectedHandler()(e)
          }
        }}
      />
    )
  } 
}

