import React from 'react';

import clsx from 'clsx';

import { ComplexButtonsProps } from './types';

import styles from './Pagination.module.scss';
import { EmptyButton } from './EmptyButton';
import { PlainButtons } from './PlainButtons';

export const ComplexButtons = ({ table, maxPage }: ComplexButtonsProps) => {
  const currentIndex = table.getState().pagination.pageIndex;

  const firstSpred = currentIndex < 4;
  const lastSpred = currentIndex > maxPage - 5;
  const centerSpred = !firstSpred && !lastSpred;
  const zoomOut = maxPage > 9999;

  return <>
    {
      firstSpred 
        ? <PlainButtons count={5} table={table} start={0} zoomOut={zoomOut} />
        : <div
          onClick={() => table.setPageIndex(0)}
          className={clsx(styles.btn, styles.withHover, currentIndex === 0 && styles.selected)}
        >
          <div className={clsx(styles.btnTitle, zoomOut && styles.zoomOut)}>1</div>
        </div>
    }
    {
      centerSpred 
        ? <>
          <EmptyButton />
          <PlainButtons count={3} table={table} start={currentIndex - 1} zoomOut={zoomOut} />
          <EmptyButton />
        </>
        : <EmptyButton />
    }
    
    {
      lastSpred 
        ? <PlainButtons count={5} start={maxPage - 5} table={table} zoomOut={zoomOut} />
        : <div
          onClick={() => table.setPageIndex(maxPage - 1)}
          className={clsx(styles.btn, styles.withHover, currentIndex === (maxPage - 1) && styles.selected)}
        >
          <div className={clsx(styles.btnTitle, zoomOut && styles.zoomOut)}>{maxPage}</div>
        </div>
    }
  </>;
};
