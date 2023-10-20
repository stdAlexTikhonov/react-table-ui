import { Positions } from '@components/Table/types';
import { Table } from '@tanstack/react-table';

export const getFooterMethod = <T>(position: Positions, table: Table<T>) => ({
  [Positions.LEFT]: table.getLeftFooterGroups,
  [Positions.RIGHT]: table.getRightFooterGroups,
  [Positions.CENTER]: table.getCenterFooterGroups
}[position]);
