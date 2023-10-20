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

export const TableBasic = () => {
  const [data] = useState(makeData(20));
  
  const table = useTable({
    columns,
    data,
    meta: {
      size: 'M'
    },
    rowColors: 'error'
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} height={500} />
  </Table.Root>
};
TableBasic.storyName = 'Таблица TableBasic';


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


export const TableEditable = () => {
  const [data] = useState(makeData(50));
  
  const table = useTable({
    columns,
    data,
    meta: {
      editable: true,
      size: 'L'
    }
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} height={500} />
  </Table.Root>
};
TableEditable.storyName = 'Таблица TableEditable';


export const TableExpandedRows = () => {

  const [data] = useState(makeData(5).map((row) => ({
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
TableExpandedRows.storyName = 'Таблица TableExpandedRows';


export const TableFilters = () => {
  const [data] = useState(makeData(50));
  
  const table = useTable({
    columns,
    data,
    enableColumnFilters: true
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} height={500} />
  </Table.Root>
};
TableFilters.storyName = 'Таблица TableFilters';


export const TableFiltersWithBackend = () => {
  const [base] = useState(makeData(10));
  const [data, setData] = useState(base);

  const handleFilterChange = ({ id, mode, value}: FilterState) => {

    if (mode === 'contains') {
      if (value.length > 0) {
        const filtered = base.filter(row => row?.[id as keyof Formation]?.toString().includes(value));
        setData(filtered);
      } else setData(base);
     
    } else if (mode === 'multipleChoice') {
      if (value.length > 0) {
        const values = value.split(',');
        const filtered = base.filter(row => {
          const currentValue = row?.[id as keyof Formation]?.toString();
          return values.some(value => currentValue?.includes(value));
        });
        setData(filtered);
      } else setData(base);
    }
  }

  const handleLoadUniqueValues = (column: string) => {
    const res = data.reduce((acc, row) => {
      return acc.concat([row[column as keyof Formation]])
    }, [] as any);

    const uniqueValues = Array.from(new Set(res));

    return Promise.resolve(uniqueValues as string[]);
  }
  
  const table = useTable<Formation>({
    columns,
    data,
    enableColumnFilters: true,
    meta: {
      onFilterChange: handleFilterChange,
      loadUniqueValues: handleLoadUniqueValues
    }
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} height={400} width={'100%'} />
  </Table.Root>
};
TableFiltersWithBackend.storyName = 'Таблица TableFiltersWithBackend';


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
TableFooter.storyName = 'Таблица TableFooter';


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

export const TableInfiniteScroll = () => <QueryClientProvider client={queryClient}>
  <InnerTable />
</QueryClientProvider>;

TableInfiniteScroll.storyName = 'Таблица TableInfiniteScroll';



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


export const TableMultiRowSelection = () => {
  const [data] = useState(makeData(10));
  const multipleSelect = getMultipleSelect<Formation>();
  
  const table = useTable({
    columns: [multipleSelect, ...columns],
    data,
    enableMultiRowSelection: true,
    meta: {
      enableFooter: true
    }
  });

  return <Table.Root>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};
TableMultiRowSelection.storyName = 'Таблица TableMultiRowSelection';


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


export const TableRowSelection = () => {
  const [data] = useState(makeData(10));
  
  const table = useTable({
    columns,
    data,
    enableRowSelection: true
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};
TableRowSelection.storyName = 'Таблица TableRowSelection';


export const TableVirtualization = () => {
  const [largeRows] = useState(makeData(1000, 10));
  
  const largeColumns = useMemo(() => Object.keys(largeRows[0]).map(key => {
    return { accessorKey: key };
  }), []);
  
  const table = useTable({
    columns: largeColumns,
    data: largeRows,
    meta: {
      enableColumnVirtualization: true,
      enableRowVirtualization: true,
      editable: true,
      size: 'S'
    },
    compound: 'status-0'
  });

  return <Table.Root>
    <Table.ColumnSettings table={table} />
    <Table.TableComponent table={table} height={500} width={1500} />
  </Table.Root>
};
TableVirtualization.storyName = 'Таблица TableVirtualization';

