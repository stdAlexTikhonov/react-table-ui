import { Table } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Sizes } from '../types';


export const useRowsVirtualization = (
  table: Table<any>,
  tableContainerRef: React.RefObject<HTMLDivElement>,
  size: keyof typeof Sizes
) => {
  const { getRowModel } = table;
  const { rows } = getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => Sizes[size], // todo add rowHeight prop
    getScrollElement: () => tableContainerRef.current,
    measureElement: element => element?.getBoundingClientRect().height,
    overscan: 4
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  return {
    virtualRows,
    paddingTop,
    paddingBottom,
    rowVirtualizer
  };
};
