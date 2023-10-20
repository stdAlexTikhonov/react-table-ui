import React, { useState } from 'react';
import { Table, makeData, useTable, expandedColumns } from '../../..';

/*
 * Таблица с расрывающимися строками 
 * Для включения этой функции необходимо:
 *  - Указать enableExpanding: true
 *  - В структуре data, в объекте строки, которая должна раскрываться, добавить поле которое будет отвечать за вложенные данные в данном примере subRows, и
 *    передать этому полю значением массив схожий семантически с родительским объектом/массивом
 *  - Задать свойсто getSubRows: (row: Row) => row.subRows - функция к которой обращается таблица для получения подстрок. Функция должна возвращать значение поля
 *    содержащего подстроки(массив) каждой строки.
 *  - Переопределить параметр cell в конфигурации колонок у колонки ячейки которой будут отвечать за раскрытие строк
*/
export const TableExpandedRows = () => {

  const [data] = useState(makeData(500).map((row) => ({
    ...row,
    subRows: makeData(5)
  })));
  
  const table = useTable({
    columns: expandedColumns,
    data,
    getSubRows: (row: any) => row.subRows,
    enableExpanding: true
  });

  return <Table.Root>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};