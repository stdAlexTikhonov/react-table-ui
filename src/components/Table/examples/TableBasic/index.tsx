import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

/*
 * Базовый компонент таблицы
 * Для того чтобы вывести простую таблицу достаточно задать параметры data и columns
*/
export const TableBasic = () => {
  const [data] = useState(makeData(20));
  
  const table = useTable({
    columns,
    data,
    meta: {
      size: 'M'
    },
    rowColors: 'error'
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} height={500} />
  </Table.Root>
};