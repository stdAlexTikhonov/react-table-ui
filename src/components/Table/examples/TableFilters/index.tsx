import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

/*
 * Таблица с фильтрацией
 * Для того чтобы включить фильтрацию задайте свойство
 * 
 *  - enableColumnFilters: true
 * 
 * Фильтры добавятся для всех колонок
 * 
 * Если необходимо отключить фильтры на некоторых из них, в конфигурации колонок можно задать
 * 
 *  - enableColumnFilter: false
 * 
 * для отдельной колонки
*/
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