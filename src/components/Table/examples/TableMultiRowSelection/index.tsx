import React, { useState } from 'react';
import { Table, makeData, useTable, columns, getMultipleSelect } from '../../..';
import { Formation } from '../../types';

export const TableMultiRowSelection = () => {
  const [data] = useState(makeData(10));
  const multipleSelect = getMultipleSelect<Formation>();
  
  const table = useTable({
    columns: [multipleSelect, ...columns],
    data,
    enableMultiRowSelection: true,
    meta: {
      enableFooter: true
    }
  });

  return <Table.Root>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};