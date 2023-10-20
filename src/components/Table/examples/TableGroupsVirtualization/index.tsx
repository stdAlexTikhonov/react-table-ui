import React, { useState } from 'react';
import { Table, makeData, useTable, columnGroupsVirtualization } from '../../..';

export const TableGroupsVirtualization = () => {
  const [data] = useState(makeData(100));
  
  const table = useTable({
    columns: columnGroupsVirtualization,
    data,
    meta: {
      enableColumnVirtualization: true,
      enableRowVirtualization: true,
      size: 'L'
    }
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} height={500} width={1500} />
  </Table.Root>
};