import { Row } from '@tanstack/react-table';
import { Positions } from '../types';

// from tanstack sources
// https://github.com/TanStack/table/blob/88977fa0aa9d714000069515f340e25a82c9217c/packages/table-core/src/core/table.ts#L200
const SEPARATOR = '.';

export {
  columns,
  columnsEn,
  columnHelper,
  columnGroups,
  columnGroupsVirtualization,
  expandedColumns
} from './columns';
export { makeData, fetchData } from './makeData';

export const vertical: Record<string, number> = {
  Up: -1,
  Down: 1,
  Enter: 1
};

export const horizontal: Record<string, number> = {
  Left: -1,
  Right: 1,
  Tab: 1
};

export const getRowData = (rowData: Row<unknown>) => ({
  [Positions.CENTER]: rowData.getCenterVisibleCells,
  [Positions.LEFT]: rowData.getLeftVisibleCells,
  [Positions.RIGHT]: rowData.getRightVisibleCells
});

export const getLevelIndexes = <T>({id, depth, index}: Row<T>) => {
  const ids = id.split(SEPARATOR);
  // take pre last index for support depth > 1 levels
  const rowIndex = depth > 0 ? Number(ids.at(-1)) : index;
  const parentIndex = depth > 0 ? Number(ids.at(-2)) : -1;
  return {parentIndex, rowIndex}
}

export { getMultipleSelect } from './multipleSelect';

export const delay = (delayInms: number) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}