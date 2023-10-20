import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

export const TableRowSelection = () => {
  const [data] = useState(makeData(10));
  
  const table = useTable({
    columns,
    data,
    enableRowSelection: true
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};