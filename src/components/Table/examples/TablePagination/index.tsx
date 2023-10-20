import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

export const TablePagination = () => {
  const [data] = useState(makeData(100));
  
  const table = useTable({
    columns,
    data,
    enableRowSelection: true,
    enableColumnFilters: true,
    meta: {
      pagination: true,
      size: 'L',
      rowColors: ['success', 'success_light', 'warning', 'warning_light', 'error', 'error_light']
    }
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};