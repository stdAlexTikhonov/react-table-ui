import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

export const TableFooter = () => {
  const [data] = useState(makeData(10));
  
  const table = useTable({
    columns,
    data,
    meta: {
      enableFooter: true
    }
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};