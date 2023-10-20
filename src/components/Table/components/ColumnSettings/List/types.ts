import { Header } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export type Headers = Header<unknown, unknown>[];

export interface RowProps {
  data: string[];
  index: number;
  style: CSSProperties;
}