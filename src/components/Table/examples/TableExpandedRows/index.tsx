import React, { useState } from 'react';
import { Table, makeData, useTable, expandedColumns } from '../../..';

export const TableExpandedRows = () => {

  const [data] = useState(makeData(5).map((row) => ({
    ...row,
    subRows: makeData(5)
  })));
  
  const table = useTable({
    columns: expandedColumns,
    data,
    getSubRows: (row: any) => row.subRows,
    enableExpanding: true
  });

  return <Table.Root>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};