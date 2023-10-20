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
 * Таблица с группировкой колонок и включеной виртуализацией
 * В конфигурации колонок у каждой колонки можно задать свойство columns которое так же принимает массив колонок.
 * 
 * {
 *    id: 'column1',
 *    columns: [
 *      {
 *        id: 'inner-column-1'
 *      },
 *      {
 *        id: 'inner-column-1'
 *      }
 *    ]
 *  },
 * 
 * Чтобы включить горизонтальную виртуализацию:
 *  - meta: { enableColumnVirtualization: true }
 * 
 * Вертикальную:
 *  - meta: { enableRowVirtualization: true }
 * 
*/
export const TableGroupsVirtualization = () => {
  const [data] = useState(makeData(100));
  
  const table = useTable({
    columns: columnGroupsVirtualization,
    data,
    meta: {
      enableColumnVirtualization: true,
      enableRowVirtualization: true,
      size: 'L'
    }
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} height={500} width={1500} />
  </Table.Root>
};
TableGroupsVirtualization.storyName = 'Таблица TableGroupsVirtualization';

