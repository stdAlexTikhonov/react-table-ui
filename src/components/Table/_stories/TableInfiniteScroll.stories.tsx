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

const queryClient = new QueryClient();

const useTableOptions = (refContainer: RefObject<HTMLDivElement>) => {
  const [lang, setLang] = useState('ru');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [pageCount, setPageCount] = useState(-1);

  const { data, fetchNextPage, isFetching, isLoading } =
  useInfiniteQuery<FormationApiResponse>(
    ['table-data', sorting, pagination], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
    async ({ pageParam = 0 }) => {
      const start = pageParam * pagination.pageSize
      const fetchedData = fetchData(start, pagination.pageSize, sorting, pagination) //pretend api call
      return fetchedData
    },
    {
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  );

  const flatData = useMemo(
    () => data?.pages?.flatMap(page => page.data).filter(item => item) ?? [],
    [data]
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0
  const totalFetched = flatData.length;

  useEffect(() => {
    setPageCount(Math.ceil(totalDBRowCount / pagination.pageSize));
  }, [pagination.pageSize])

  const fetchMoreOnBottomReached = React.useCallback(
    async (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          setPageCount(Math.ceil(totalDBRowCount / pagination.pageSize));
          await fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchMoreOnBottomReached(refContainer.current)
  }, [fetchMoreOnBottomReached])
  
  const table = useTable({
    columns: lang === 'ru' ? columns : columnsEn,
    state: {
      sorting,
      pagination
    },
    pageCount,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    data: flatData,
    manualPagination: true,
    enableColumnFilters: true,
    meta: {
      enableRowVirtualization: true,
      editable: true,
      lang,
      size: 'L'
    }
  });

  return {
    table,
    fetchMoreOnBottomReached,
    isLoading,
    lang,
    setLang
  }
};


const InnerTable = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { table, isLoading, fetchMoreOnBottomReached, setLang } = useTableOptions(tableContainerRef);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
  }

  return <>
    <Table.Root>
      <div style={{ display: 'flex' }}>
        <select onChange={handleChange}>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
        <Table.ColumnSettings table={table} />
        <Table.GlobalFilter table={table} />
      </div>
      <Table.TableComponent
        table={table}
        height={500}
        width={'100%'}
        loading={isLoading}
        ref={tableContainerRef}
        onScroll={(e) => { void fetchMoreOnBottomReached(e.currentTarget) }}
      />
    </Table.Root>
  </>
};

/*
 * Таблица с динамической подгрузкой
 * 
 * Данный пример реализован с применением библиотеки @tanstack/react-query
 *
 * Взаимодействие таблицы и хука useInfiniteQuery происходит через:
 *  - ref ссылку на компонент таблицы
 *  - контролируемое состояние SortingState
 *  - контролируемое состояние PaginationState
 *  - метод onScroll компонента таблицы
 *  - enableRowVirtualization: true
 *  - pageCount
 * 
 *  Пример минимальной конфигурации:
 *  columns: columns
 *  state: {
 *    sorting,
 *    pagination
 *  },
 *  pageCount,
 *  onSortingChange: setSorting,
 *  onPaginationChange: setPagination,
 *  data: flatData,
 *  meta: {
 *    enableRowVirtualization: true,
 *  }
 * 
 *  <Table.TableComponent
 *    table={table}
 *    loading={isLoading}
 *    ref={tableContainerRef}
 *    onScroll={(e) => { void fetchMoreOnBottomReached(e.currentTarget) }}
 *  />
*/
export const TableInfiniteScroll = () => <QueryClientProvider client={queryClient}>
  <InnerTable />
</QueryClientProvider>;

TableInfiniteScroll.storyName = 'Таблица TableInfiniteScroll';

