import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';
/*
 * Таблица с возможностью выбора строки
 * Для того чтобы включить выбор строки включите свойство enableRowSelection
 * 
 *  - enableRowSelection: true
 * 
 * Есть возможноть контролиовать выбор через state и onRowSelectionChange
 * 
 *  - const [selection, setSelection] = useState({})
 * 
 *  - state: { rowSelection: selection }
 *  - onRowSelectionChange: setSelection
 * 
*/
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