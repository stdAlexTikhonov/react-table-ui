import React, { RefObject, useRef, useState, useEffect, useMemo } from 'react';

import Table, {
  makeData,
  useTable,
  expandedColumns,
  columns,
  FilterState,
  columnGroups,
  columnGroupsVirtualization,
  SortingState,
  PaginationState,
  columnsEn
} from '../index';

import { Formation, FormationApiResponse } from '../types';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import { fetchData, delay, getMultipleSelect } from '../utils';


export default {
  title: 'Table/Table/Stories',
  parameters: {
    chromatic: { disableSnapshot: true },
  }
};

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
TableCompound.storyName = 'Таблица TableCompound';

