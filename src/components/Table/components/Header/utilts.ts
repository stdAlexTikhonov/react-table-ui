import { ColumnOrderState } from '@tanstack/react-table';
import { Positions } from '@components/Table/types';
import { Table } from '@tanstack/react-table';
import { useCallback } from 'react';

export const getHeaderGroupsMethod = <T>(position: Positions, table: Table<T>) => ({
  [Positions.LEFT]: useCallback(() => table.getLeftHeaderGroups(), []),
  [Positions.RIGHT]: useCallback(() => table.getRightHeaderGroups(), []),
  [Positions.CENTER]: useCallback(() => table.getCenterHeaderGroups(), [])
}[position]);

export const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  );
  return [...columnOrder];
};
