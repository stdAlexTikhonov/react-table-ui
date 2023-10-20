import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

export const TableCompound = () => {
  const [data] = useState(makeData(20));
  
  const table = useTable({
    columns,
    data,
    meta: {
      size: 'M'
    },
    rowColors: 'error',
    compound: ['status-0', 'progress-0']
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={1500} height={500} />
  </Table.Root>
};