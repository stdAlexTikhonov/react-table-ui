import { UIEventHandler } from 'react';
import { Table } from '@tanstack/react-table';

export interface Props {
  table: Table<any>;
  height?: number | string;
  width?: number | string;
  loading?: boolean;
  errorText?: string;
  onScroll?: UIEventHandler<HTMLDivElement>;
}
