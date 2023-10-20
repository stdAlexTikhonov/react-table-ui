import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

export const TableFilters = () => {
  const [data] = useState(makeData(50));
  
  const table = useTable({
    columns,
    data,
    enableColumnFilters: true
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} height={500} />
  </Table.Root>
};