import React from 'react';

import clsx from 'clsx';

import styles from './FooterCell.module.scss';
import {HeaderContext} from '@tanstack/react-table'

export function FooterCell<T>({ column, table }: HeaderContext<T, unknown>) {
  const columnValues = table.getRowModel().rows.map((row) =>
    row?.getVisibleCells().find((cell) => cell.column.id === column.id)?.getValue<string | number>()
  ).filter((value): value is string | number => value !== undefined);

  const totalSum = columnValues.reduce(
    (acc: number, value: string | number) => acc + Number(value),
    0
  );

  const isNumber = !isNaN(totalSum);
  const isCheckbox = column.id === 'select';

  return (
    <div className={clsx(styles.cell, isNumber && styles.number)}>
      {isNumber && !isCheckbox
        ? table.options.meta?.formatNumericValue?.(totalSum) ??
          totalSum.toFixed(2)
        : null}
    </div>
  );
}
