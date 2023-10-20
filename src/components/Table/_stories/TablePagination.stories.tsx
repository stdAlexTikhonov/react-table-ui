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
 * Таблица с пагинацией
 * Для того чтобы включить пагинацию добавьте мета свойство pagination
 * 
 *  - meta: { pagination: true }
 * 
*/
export const TablePagination = () => {
  const [data] = useState(makeData(100));
  
  const table = useTable({
    columns,
    data,
    enableRowSelection: true,
    enableColumnFilters: true,
    meta: {
      pagination: true,
      size: 'L',
      rowColors: ['success', 'success_light', 'warning', 'warning_light', 'error', 'error_light']
    }
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};
TablePagination.storyName = 'Таблица TablePagination';

