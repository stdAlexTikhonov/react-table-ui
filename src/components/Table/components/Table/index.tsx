import React, { useEffect, UIEventHandler, createRef, RefObject, useState, PropsWithChildren, forwardRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useColumnVirtualization } from '@components/Table/hooks/useColumnVirtualization';
import useDimensions from 'react-cool-dimensions';
import clsx from 'clsx';
import _get from 'lodash/get';
import { useTranslation } from 'react-i18next';

import { Props } from './types';

import styles from './Table.module.scss';

import { Body, VirtualBody, VerticalVirtualBody } from '../Body';
import { Footer, VirtualFooter } from '../Footer';
import { Header, TopLevelHeaders, VirtualHeader } from '../Header';
import { Pagination } from '../Pagination';
import { Loading } from '../Loading';
import { createDragDropManager } from 'dnd-core'
import { useRowsVirtualization } from '@components/Table/hooks/useRowVirtualization';
import { Positions, Sizes } from '@components/Table/types';
import { useCopyPaste } from '@components/Table/hooks/useCopyPaste';
import { PinnedTable } from '../PinnedTable';
import { ContextMenu } from '../ContextMenu';
import { useForwardedRef } from '../../hooks/useForwardedRef';

export const manager = createDragDropManager(HTML5Backend);
const DEFAULT_PAGINATION_HEIGHT = 60;
const DEFAULT_HEADER_ROW_HEIGHT = 32;
const MARGIN_AND_PADDINGS = 32;

const TableVirtualWrapper: React.FC<PropsWithChildren<{enabled: boolean}>> = ({children, enabled}) => enabled ? <div style={{height: 'fit-content'}}>{children}</div> : <>{children}</>

export const Table = forwardRef<HTMLDivElement, Props>(({
  table,
  height,
  width = '100%',
  loading,
  errorText,
  onScroll
}, ref): JSX.Element => {
  const { i18n } = useTranslation();
  const { observe, width: innerWidth, height: innerHeight } = useDimensions();
  const tableContainerRef = useForwardedRef(ref);

  const { pagination: pg, enableFooter, lang, id, zIndex, size, borderWrapper = true } = _get(table, 'options.meta') || { size: Sizes.S };

  const paginationFlag = (pg || table.options.manualPagination);
  const baseHeight = innerHeight - (paginationFlag ? DEFAULT_PAGINATION_HEIGHT : 0);
  const columns = table.getAllFlatColumns();
  const leftTotalSize = table.getLeftTotalSize();
  const rightTotalSize = table.getRightTotalSize();
  const centerTotalSize = table.getCenterTotalSize();
  const totalSize = leftTotalSize + centerTotalSize + rightTotalSize;
  const emptySpace = totalSize < innerWidth;
  const coeficent = innerWidth / totalSize;
  
  const headerGroupCount = table.getCenterHeaderGroups().length;
  const topHeaderGroupCount = headerGroupCount - 1;
  const [parentRef] = useState<RefObject<HTMLDivElement>[]>(Array.from({ length: topHeaderGroupCount}, () => createRef()));

  const { sorting, pagination } = table.getState();

  const SIZE = Number(Sizes[size ?? 'S']);
  
  const leafColumns = columns.map((item: { id: string; }) => item.id);
  const widths = columns.map(column => column.getSize());

  useEffect(() => {
    if (baseHeight > 0) {
      table.setColumnOrder(leafColumns);
      const headerFilterFooter = headerGroupCount + 2; //extra two cells for filter and footer 
      const headerHeight = headerFilterFooter * (SIZE ?? DEFAULT_HEADER_ROW_HEIGHT) + MARGIN_AND_PADDINGS;
      
      table.setState(state => ({
        ...state,
        baseHeight: baseHeight - headerHeight,
        tablePosition: Positions.CENTER,
        columnSizing: leafColumns.reduce((acc, value, index) => {
          const size = widths[index];
          return ({ ...acc, [value]: emptySpace ? size * coeficent : size })
        }, {})
      }));
    }
  }, [baseHeight]);

  useEffect(() => {
    if (tableContainerRef.current) tableContainerRef.current.scrollTop = 0;
    void i18n.changeLanguage(lang);
  }, [sorting, pagination.pageIndex, lang]);

  const virtualColumnsProps = useColumnVirtualization(table, tableContainerRef);
  const virtualRowsProps = useRowsVirtualization(table, tableContainerRef, size as keyof typeof Sizes || 'S');

  const isVirtual =
    table.options.meta?.enableColumnVirtualization;

  const enabledTopLevelPinned = Boolean(isVirtual && topHeaderGroupCount > 0);

  const copyPasteProps = useCopyPaste(
    table,
    isVirtual ? virtualColumnsProps.virtualColumns : undefined,
    isVirtual ? virtualRowsProps.virtualRows : undefined
  );

  const { tableHandlers,  onCloseMenu, state } = copyPasteProps;
  const displayLoading = (loading || errorText);

  const shouldSetDefaultHeight = displayLoading && table.options.data.length === 0 && !height;

  const handleScroll: UIEventHandler<HTMLDivElement> = e => {
    parentRef.forEach(item => {
      if (item.current) item.current.scrollLeft = e.currentTarget.scrollLeft;
    });
    onScroll?.(e);
  };

  const totalHeight = height ? baseHeight : 'unset';


  return (
    <div className={styles.commonWrapper} style={{ width, height, zIndex }} ref={observe}>
      <DndProvider manager={manager}>
        {displayLoading && <Loading loading={loading} errorText={errorText} />}
        <div
          data-id={id}
          ref={tableContainerRef}
          style={{ height: shouldSetDefaultHeight ? 200 : totalHeight }}
          className={clsx(styles.overflow, styles.table_wrapper, borderWrapper && styles.borderWrapper)}
          onScroll={handleScroll}
        >
          <PinnedTable
            width={leftTotalSize}
            className={clsx(styles.table, styles.left_pinned)}
          >
            <Header table={table} position={Positions.LEFT} />
            {
              isVirtual 
                ? <VerticalVirtualBody table={table} {...copyPasteProps} {...virtualRowsProps} position={Positions.LEFT} />
                : <Body table={table} position={Positions.LEFT} {...copyPasteProps} />
            }
            {enableFooter && <Footer table={table} position={Positions.LEFT} />}
          </PinnedTable>
          <TableVirtualWrapper enabled={enabledTopLevelPinned}>
            {enabledTopLevelPinned && <div className={styles.pinned_headers} style={{ left: leftTotalSize, width: innerWidth - leftTotalSize - rightTotalSize }}>
              {isVirtual && <TopLevelHeaders table={table} headerRef={parentRef} />}
            </div>} 
            <table
              style={{
                width: isVirtual
                  ? virtualColumnsProps.virtualPaddingRight
                  : emptySpace ? width : centerTotalSize
              }}
              className={styles.table}
            >
              {isVirtual ? <VirtualHeader table={table} {...virtualColumnsProps} /> : <Header table={table} />}
              {
                isVirtual 
                  ? <VirtualBody table={table} {...virtualColumnsProps} {...virtualRowsProps} {...copyPasteProps} />
                  : <Body table={table} {...copyPasteProps} />
              }
              {enableFooter  && (isVirtual
                ? <VirtualFooter table={table} {...virtualColumnsProps} />
                : <Footer table={table} />
              )}
            </table>
          </TableVirtualWrapper>
          <PinnedTable
            width={rightTotalSize}
            className={clsx(styles.table, styles.right_pinned)}
          >
            <Header table={table} position={Positions.RIGHT} />
            {
              isVirtual 
                ? <VerticalVirtualBody table={table} {...copyPasteProps} {...virtualRowsProps} position={Positions.RIGHT} />
                : <Body table={table} position={Positions.RIGHT} {...copyPasteProps} />
            }
            {enableFooter  && <Footer table={table} position={Positions.RIGHT} />}
          </PinnedTable>
        </div>
        {paginationFlag && <Pagination table={table} />}
        {!table.options.enableExpanding && <ContextMenu
          show={state.showContextMenu}
          onClose={onCloseMenu}
          top={state.contextTop}
          left={state.contextLeft}
          onCopy={tableHandlers.onCopy}
          onPaste={tableHandlers.onPaste}
        />}
      </DndProvider>
    </div>
  );
});
