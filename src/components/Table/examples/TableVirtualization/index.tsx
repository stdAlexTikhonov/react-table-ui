import React, { useState, useMemo } from 'react';
import { Table, makeData, useTable } from '../../..';

export const TableVirtualization = () => {
  const [largeRows] = useState(makeData(1000, 10));
  
  const largeColumns = useMemo(() => Object.keys(largeRows[0]).map(key => {
    return { accessorKey: key };
  }), []);
  
  const table = useTable({
    columns: largeColumns,
    data: largeRows,
    meta: {
      enableColumnVirtualization: true,
      enableRowVirtualization: true,
      editable: true,
      size: 'S'
    },
    compound: 'status-0'
  });

  return <Table.Root>
    <Table.ColumnSettings table={table} />
    <Table.TableComponent table={table} height={500} width={1500} />
  </Table.Root>
};