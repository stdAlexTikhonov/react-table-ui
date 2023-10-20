import React, { useRef, useMemo, useCallback, forwardRef } from 'react';
import { useVirtualizer, defaultRangeExtractor, Range } from '@tanstack/react-virtual';
import { Header, flexRender } from '@tanstack/react-table';
import { TopLevelHeaderProps } from '../../types';
import { findIndex } from 'lodash'
import clsx from 'clsx';

import styles from './TopLevelHeader.module.scss';
import { useForwardedRef } from '../../../../hooks/useForwardedRef';
import { Sizes } from '@components/Table/types';

interface Props { header: Header<unknown, unknown>, width: number, size: keyof typeof Sizes, border: boolean }

const HeaderCell = ({ header, width, size, border }: Props) => {
  const borderLeft = header.column.columnDef.meta?.borderLeft ?? border;
  const borderBottom = header.column.columnDef.meta?.borderBottom ?? border;
  return <div className={clsx(styles.cell, borderLeft && styles.border, borderBottom && styles.borderBottom, styles[`textPadding${size}`])} style={{ width, height: Sizes[size], ...header.column.columnDef.meta?.headerStyle }}>
    {flexRender(header.column.columnDef.header, header.getContext())}
  </div>;
}

export const TopLevelHeader = forwardRef<HTMLDivElement, TopLevelHeaderProps>(({ headersObject, widths, size, border }, ref) => {
  const groups = Object.keys(headersObject);
  const columns = Object.values(headersObject).reduce((acc, item) => acc.concat(item));
  const parentRef = useForwardedRef(ref);

  const activeStickyIndexRef = useRef(0)

  const stickyIndexes = useMemo(
    () => groups.map((gn) => findIndex(columns, (n) => n.id === gn)),
    [columns]
  )

  const isSticky = (index: number) => stickyIndexes.includes(index)

  const isActiveSticky = (index: number) => activeStickyIndexRef.current === index

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => widths[index],
    rangeExtractor: useCallback(
      (range: Range) => {
        activeStickyIndexRef.current = [...stickyIndexes]
          .reverse()
          .find((index) => range.startIndex >= index) ?? 0;

        const next = new Set([
          activeStickyIndexRef.current,
          ...defaultRangeExtractor(range)
        ])

        return Array.from(next).sort((a, b) => a - b)
      },
      [stickyIndexes]
    )
  });


  return <div className={styles.root} ref={parentRef}>
    <div
      className={styles.relative}
      style={{
        width: columnVirtualizer.getTotalSize()
      }}
    >
      {columnVirtualizer.getVirtualItems().map(virtualColumn => {
        const header = columns[virtualColumn.index];
        return (
          <div
            key={virtualColumn.index}
            style={{
              ...(isSticky(virtualColumn.index)
                ? {
                  zIndex: 1
                }
                : {}),
              ...(isActiveSticky(virtualColumn.index)
                ? {
                  position: 'sticky'
                }
                : {
                  position: 'absolute',
                  transform: `translateX(${virtualColumn.start}px)`
                }),
              top: 0,
              left: 0,
              width: virtualColumn.size
            }}
          >
            {header.isPlaceholder ? null : <HeaderCell header={header} width={header.getSize()} size={size} border={virtualColumn.index !== 0 && border} />}
          </div>
        )})}
    </div>
  </div>;
});
