import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

/*
 * Таблица с футером
 * Для того чтобы добавить футер используйте свойство meta: { enableFooter }
 * 
 * Для числовых колонок автоматически будет показываться сумма значений колонки.
 * 
 * В футере можно вывести свой текст или элемент воспользовавшись свойством footer в конфигурации колонок.
 * 
*/
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