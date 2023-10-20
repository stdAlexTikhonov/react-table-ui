import { IIconsProps } from '@components/Icon/types';
import { Column, Table } from '@tanstack/react-table';
import { FC } from 'react';

export interface Props {
  focused: boolean;
  setFocused: React.Dispatch<React.SetStateAction<boolean>>
  column: Column<any, unknown>;
  table: Table<any>;
  onInnerFilterChange: (filter: Record<string, string>) => void;
  filterType: string;
  borderBottom: boolean;
}

export type Range = [number, number];

export type FilterFn = {
  value: string;
  Icon: FC<IIconsProps>
}
