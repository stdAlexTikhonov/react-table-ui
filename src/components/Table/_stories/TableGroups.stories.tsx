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
 * Таблица с группировкой колонок
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
*/
export const TableGroups = () => {
  const [data] = useState(makeData(20));
  
  const table = useTable({
    columns: columnGroups,
    data
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} height={400} />
  </Table.Root>
};
TableGroups.storyName = 'Таблица TableGroups';

