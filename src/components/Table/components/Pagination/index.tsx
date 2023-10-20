import React from 'react';

import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { IconChevronLeft24, IconChevronRight24 } from '@components/Icon/IconsList/24';

import { Props } from './types';

import styles from './Pagination.module.scss';
import { PlainButtons } from './PlainButtons';
import { ComplexButtons } from './ComplexButtons';

export const Pagination = ({ table }: Props) => {
  const { t } = useTranslation();

  const MAX_PAGE = table.getPageCount();

  const isPlainButtons = MAX_PAGE <= 5;

  return (
    <div className={styles.wrapper}>
      <div className={styles.show}>
        <div className={styles.showTitle}>{t('pagination.show')}</div>
        <select
          className={styles.select}
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {Array.from({ length: 6 }, (value, index) => index * 10).slice(1).map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {t('pagination.rows', { count: pageSize })}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.controls}>
        <div
          onClick={() => table.getCanPreviousPage() && table.previousPage()}
          className={clsx(styles.btn, !table.getCanPreviousPage() && styles.disabled)}
        >
          <div className={styles.chevron}>
            <IconChevronLeft24 color='inherit' />
          </div>
        </div>
        {
          isPlainButtons
            ? <PlainButtons count={MAX_PAGE} table={table} start={0} />
            : <ComplexButtons maxPage={MAX_PAGE} table={table} />
        }
        <div
          onClick={() => table.getCanNextPage() && table.nextPage()}
          className={clsx(styles.btn, !table.getCanNextPage() && styles.disabled)}
        >
          <div className={styles.chevron}>
            <IconChevronRight24 color='inherit' />
          </div>
        </div>
        
      </div>
    </div>
  );
}
