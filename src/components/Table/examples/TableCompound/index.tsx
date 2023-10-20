import React, { useState } from 'react';
import { Table, makeData, useTable, columns } from '../../..';

/*
 * Таблица с объединением ячеек по вертикали
 * Для объединения ячеек по вертикали укажите в свойстве compound идентификатор колонки ячейки котоой хотите объединить. Таблица объединит ячейки идущие друг за
 * другом 
 * если значения будут повторяться.
 * Если вы хотите объединить ячейки в нескольких колонках укажите в compound массив с идентификаторами колонок.
 * Если вы хотите включить объединение во всех колонках - укажите compound: true
 * 
 * Примеры значений:
 *  - compound: true
 *  - compound: 'brigadier-0'
 *  - compound: ['status-0', 'progress-0']
*/
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