import { CSSProperties } from 'react';

import { RowData, Table } from '@tanstack/react-table';
import { Compound, Sizes, Types } from './types';

declare module '@tanstack/react-table' {
  interface FilterState {
    id: string;
    mode: string;
    value: string;
  }
  interface TableMeta {
    isNumbers?: Record<string, boolean>;
    id?: string;
    updateData?: (rows: RowData[]) => void;
    onPaste?: (rows: RowData[]) => void;
    updateCell?: (rowIndex: number, columnId: string, value: unknown, groupIndex?: number) => void;
    formatNumericValue?: (value: number) => string;
    border?: boolean;
    enableColumnVirtualization?: boolean;
    enableRowVirtualization?: boolean;
    pagination?: boolean;
    enableFooter?: boolean;
    onFilterChange?: (props: FilterState) => void;
    loadUniqueValues?: (columnId: string) => Promise<string[]>;
    onGlobalFilterChange?: (value: string) => void;
    onSelectionChange?: (value: RowSelectionState) => void;
    editable?: boolean;
    lang?: string;
    [k: string]: any;
    zIndex?: number;
    rowColors?: `${Types}`[] | Record<number,`${Types}`>;
    size?: keyof typeof Sizes;
    borderWrapper?: boolean;
  }

  interface TableState {
    baseHeight: number;
    selectIsActive: boolean;
    tablePosition: Positions;
    compound: Compound[];
  }


  interface ColumnMeta<TData extends RowData> {
    disabled?: (table: Table<TData>, rowId: string) => boolean;
    title?: string;
    headerStyle?: CSSProperties;
    textAlign?: string;
    borderLeft?: boolean;
    borderBottom?: boolean;
  }
}
