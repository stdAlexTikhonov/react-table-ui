import React from 'react';

import clsx from 'clsx';

import { PlainButtonsProps } from './types';

import styles from './Pagination.module.scss';



export const PlainButtons = ({ count, table, start, zoomOut }: PlainButtonsProps) => {
  const currentIndex = table.getState().pagination.pageIndex;

  return <>
    {
      Array.from({ length: count }).map((_, i) => <div
        key={i}
        onClick={() => table.setPageIndex(start + i)} 
        className={clsx(styles.btn, styles.withHover, currentIndex === (start + i) && styles.selected)}
      ><div className={clsx(styles.btnTitle, zoomOut && styles.zoomOut)}>{start + i + 1}</div></div>)
    }
  </>;
};