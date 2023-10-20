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

const useQuery = ({ pageIndex, pageSize }: PaginationState, sorting: SortingState) => {
  const [rows, setRows] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(-1);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    void delay(1000).then(() => {
      void fetchData(pageIndex * pageSize, pageSize, sorting).then(({ data, meta }) => {
        setRows(data);
        setPageCount(Math.ceil(meta.totalRowCount / pageSize));
        setLoading(false);
        setError(pageIndex === 5 ? 'Упс, ошибка :(' : '');
      });
    })
    
  }, [pageIndex, pageSize, sorting])
     
  return { rows, pageCount, loading, error };
}

/*
 * Таблица с контролируемой пагинацией
 * Для того чтобы включить контролируемую пагинацию
 *  
 *  - manualPagination: true,
 *  - pageCount - общее количество страниц
 * 
 * Создайте стейт пагинации
 *   - const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
 * 
 * И свяжите его с таблицей 
 *  - state: { pagination } 
 *  - onPaginationChange: setPagination
 * 
*/
export const TableManualPagination = () => {
  
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { rows, pageCount, loading, error } = useQuery(pagination, sorting);
  
  const table = useTable({
    columns,
    data: rows,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    pageCount: pageCount,
    manualPagination: true
  });

  return <Table.Root>
    <Table.ColumnSettings table={table} />
    <Table.TableComponent table={table} height={500} loading={loading} errorText={error} width={'100%'} />
  </Table.Root>
};
TableManualPagination.storyName = 'Таблица TableManualPagination';

