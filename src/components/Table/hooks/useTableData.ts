import { Column, ColumnPinningPosition, Table } from '@tanstack/react-table';
import { Positions } from '../types';
import { VirtualItem } from '@tanstack/react-virtual';
import { getVirtualItem } from '../components/Table/utilts';

export const getColumnsMethod = <T>(position: Positions, table: Table<T>) => ({
  [Positions.LEFT]: table.getLeftVisibleLeafColumns,
  [Positions.RIGHT]: table.getRightVisibleLeafColumns,
  [Positions.CENTER]: table.getCenterVisibleLeafColumns
}[position]);

export const useTableData = (
  table: Table<unknown>,
  position: Positions,
  virtualColumns?: VirtualItem[],
  virtualRows?: VirtualItem[]) => {
  const isCenter = position === Positions.CENTER;
  
  const getColumns = getColumnsMethod(position, table);
  const basicColumns = getColumns();
  const order = basicColumns.map((item: Column<unknown, unknown>) => item.id) as string[];
  const basicRows = table.getRowModel().rows;

  const rows = virtualRows && isCenter
    ? virtualRows.map(item => getVirtualItem(basicRows, item, true)).map(row => row.original) 
    : basicRows.map(item => item.original);

  const columns = virtualColumns && isCenter
    ? virtualColumns.map((item: VirtualItem) => getVirtualItem(basicColumns, item, true)).filter(item => item)
    : basicColumns.filter(item => item);

  const widths = virtualColumns && isCenter
    ? virtualColumns.map((column: VirtualItem) => basicColumns[column.index].getSize())
    : basicColumns.map(item => item.getSize());

  const prepPositions = virtualColumns ? [virtualColumns[0].start].concat(widths).slice(0, -1) : [0].concat(widths).slice(0, -1);

  function getPositions() {
    
    const constPositionType = position.toLowerCase() as ColumnPinningPosition
    if (isCenter) return prepPositions.reduce((acc: number[], cur: number, index: number) => {
      return index ? ([...acc, acc[index-1] + cur]) : [cur];
    }, [])
    
    return columns.map((column: Column<unknown, unknown>) => column.getStart(constPositionType));
  }

  const positions = getPositions();

  return { order, rows, columns, positions, widths, basicRows }
}