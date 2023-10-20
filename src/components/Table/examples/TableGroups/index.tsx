import React, { useState } from 'react';
import { Table, makeData, useTable, columnGroups } from '../../..';

export const TableGroups = () => {
  const [data] = useState(makeData(20));
  
  const table = useTable({
    columns: columnGroups,
    data
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} height={400} />
  </Table.Root>
};