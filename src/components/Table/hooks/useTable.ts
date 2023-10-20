import { useState, useEffect } from 'react';

import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnResizeMode,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedUniqueValues,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  TableOptions,
  Table,
  VisibilityState,
  useReactTable
} from '@tanstack/react-table';

import { Cell } from '../components/Cell';
import { FooterCell } from '../components/FooterCell';
import { fuzzyFilter, customFilters } from '../components/Table/utilts';
import { uniqueId } from 'lodash';
import { useCompound } from './useCompound';
import { Types } from '../types';


export const useTable = <T = unknown>(
  props: Omit<TableOptions<T>, 'getCoreRowModel'> & { compound?: boolean | string | string[], rowColors?: `${Types}` | `${Types}`[] | Record<number,`${Types}`>; }
): Table<T> => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ['select']
  });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isNumbers, setIsNumbers] = useState<Record<string, boolean>>({});
  const { data, columns, compound, rowColors } = props;

  const compoundConfig = typeof compound === 'string' 
    ? useCompound(data, Boolean(compound), compound) 
    : Array.isArray(compound)
      ? useCompound(data, Boolean(compound), ...compound)
      : useCompound(data, Boolean(compound));

  const modifiedRowColors = typeof rowColors === 'string' ? [rowColors] : rowColors

  useEffect(() => {
    if (data.length > 0) {
      const [firstRow] = data;
      const hash: Record<string, boolean> = {};
    
      for (const key in firstRow) {
        const parsed = parseFloat(String(firstRow[key]));
        hash[key] = !isNaN(parsed);
      }
      setIsNumbers(hash);
    }
  }, [data])


  return useReactTable({
    data,
    columns,
    pageCount: props.pageCount,
    defaultColumn: {
      cell: Cell,
      footer: FooterCell,
      ...props.defaultColumn
    },
    columnResizeMode: props.columnResizeMode ?? columnResizeMode,
    filterFns: {
      fuzzy: fuzzyFilter,
      ...customFilters,
      ...props.filterFns
    },
    state: {
      columnVisibility: props.state?.columnVisibility ?? columnVisibility,
      columnPinning: props.state?.columnPinning ?? columnPinning,
      columnOrder: props.state?.columnOrder ?? columnOrder,
      rowSelection: props.state?.rowSelection ?? rowSelection,
      columnFilters: props.state?.columnFilters ?? columnFilters,
      globalFilter: props.state?.globalFilter ?? globalFilter,
      sorting: props.state?.sorting ?? sorting,
      expanded: props.state?.expanded ?? expanded,
      compound: compoundConfig,
      ...(props.manualPagination && { pagination: props.state?.pagination })
    },
    onExpandedChange: props.onExpandedChange ?? setExpanded,
    onColumnVisibilityChange:
      props.onColumnVisibilityChange ?? setColumnVisibility,
    onColumnPinningChange: props.onColumnPinningChange ?? setColumnPinning,
    onRowSelectionChange: props.onRowSelectionChange ?? setRowSelection,
    onColumnOrderChange: props.onColumnOrderChange ?? setColumnOrder,
    onColumnFiltersChange: props.onColumnFiltersChange ?? setColumnFilters,
    onGlobalFilterChange: props.onGlobalFilterChange ?? setGlobalFilter,
    onSortingChange: props.onSortingChange ?? setSorting,
    ...(props.manualPagination && { onPaginationChange: props.onPaginationChange }),
    getSubRows: props.getSubRows ?? undefined,
    getRowId: props.getRowId ?? undefined,
    enableExpanding: props.enableExpanding ?? false,
    globalFilterFn: props.globalFilterFn ?? fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(props.meta?.pagination && !props.manualPagination && {getPaginationRowModel:  getPaginationRowModel()}),
    manualPagination: props.manualPagination,
    enableColumnFilters: props.enableColumnFilters,
    enableGlobalFilter: props.enableGlobalFilter,
    enableRowSelection: props.enableRowSelection,
    enableMultiRowSelection: props.enableMultiRowSelection,
    meta: {
      id: uniqueId('table_guid'),
      isNumbers,
      zIndex: 3,
      rowColors: modifiedRowColors,
      ...props.meta
    }
  });
};
