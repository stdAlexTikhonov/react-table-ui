import { Row, Table } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

export const useColumnVirtualization = (
  table: Table<Row<unknown>>,
  tableContainerRef: React.RefObject<HTMLDivElement>
) => {

  const columns = table.getCenterVisibleLeafColumns();

  const columnVirtualizer = useVirtualizer({
    count: columns.length,
    estimateSize: index => {
      return columns[index].getSize();
    },
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3
  });

  if (!columnVirtualizer)
    return {
      virtualColumns: [],
      virtualPaddingLeft: 0,
      virtualPaddingRight: 0
    };

  const virtualColumns = columnVirtualizer.getVirtualItems();
  let virtualPaddingLeft = 0;
  let virtualPaddingRight = 0;

  if (virtualColumns.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return { virtualColumns, virtualPaddingLeft, virtualPaddingRight };
};
