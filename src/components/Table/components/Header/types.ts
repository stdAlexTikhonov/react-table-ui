import { RefObject } from 'react';
import { Positions, Sizes, VirtualColumnsProps } from '@components/Table/types';
import { Header, Table } from '@tanstack/react-table';


export type Headers = Header<unknown, unknown>[];

export type HeadersObject = Record<string, Headers>;
export interface HeaderProps {
  table: Table<unknown>;
  position?: Positions;
}

export interface TopLevelHeadersProps {
  table: Table<unknown>;
  headerRef: RefObject<HTMLDivElement>[];
}

export interface TopLevelHeaderProps {
  headersObject: HeadersObject;
  widths: number[];
  size: keyof typeof Sizes;
  border: boolean;
  className?: string;
}

export interface VirtualHeaderProps extends VirtualColumnsProps {
  table: Table<unknown>;
  position?: Positions;
}
export interface InnerProps {
  header: Header<unknown, unknown>;
  table: Table<unknown>;
  filterType: string;
  onFilterChange: (filter: Record<string, string>) => void;
  isNumber: boolean;
  virtual?: boolean;
}

export const enum HeaderGroups {
  CENTER = 'getCenterHeaderGroups',
  LEFT = 'getLeftHeaderGroups',
  RIGHT = 'getRightHeaderGroups'
}
