import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

/*
 * Таблица с глобальным поиском
 * Глобальный поиск реализован через компонент Table.GlobalFilter который параметром принимает объект table
*/
export const TableGlobalFilter = () => {
  const [data] = useState(makeData(10));
  
  const table = useTable({
    columns,
    data
  });

  return <Table.Root>
    <div style={{ display: 'flex', background: 'white '}}>
      <Table.ColumnSettings table={table} />
      <Table.GlobalFilter table={table} />
    </div>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};