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
TableGlobalFilter.storyName = 'Таблица TableGlobalFilter';

