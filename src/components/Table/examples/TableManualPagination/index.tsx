import React, { useEffect, useState } from 'react';
import { Table, useTable, columns } from '../../..';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { fetchData, delay } from '../../utils';
import { Formation } from '@components/Table/types';


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