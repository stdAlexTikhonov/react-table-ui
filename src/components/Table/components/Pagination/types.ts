import { Table } from '@tanstack/react-table';

export interface Props {
  table: Table<unknown>;
}

export interface PlainButtonsProps { count: number, table: Table<unknown>, start: number, zoomOut?: boolean }

export interface ComplexButtonsProps { maxPage: number, table: Table<unknown> }
