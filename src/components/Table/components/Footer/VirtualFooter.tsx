import React from 'react';

import { Positions } from '@components/Table/types';
import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

import { VirtualFooterProps } from './types';

import styles from './Footer.module.scss';

import { getVirtualItem } from '../Table/utilts';
import { VirtualPadding } from '../VirtualPadding';
import { getFooterMethod } from './utils';

export const VirtualFooter = ({
  table,
  virtualColumns,
  virtualPaddingLeft,
  virtualPaddingRight,
  position = Positions.CENTER
}: VirtualFooterProps) => {

  const getGroups = getFooterMethod(position, table);
  const footerRows = getGroups();

  const footerGroup = footerRows[0];

  return (
    <tfoot className={styles.tfoot}>
      <tr key={footerGroup.id}>
        <VirtualPadding.HeaderCell padding={virtualPaddingLeft} />
        {virtualColumns.map(
          (virtualHeader, i) => {
            const { id, colSpan, index, getSize, isPlaceholder, getContext, column } = getVirtualItem(
              footerGroup.headers,
              virtualHeader, true);

            return (
              <th
                data-index={index}
                {...{
                  key: id,
                  colSpan: colSpan,
                  style: {
                    width: getSize()
                  }
                }}
                className={clsx(
                  styles.cell,
                  table.options.meta?.border && styles.border,
                  i === 0 &&
                    table.options.meta?.border &&
                    styles.border
                )}
              >
                {isPlaceholder
                  ? null
                  : flexRender(
                    column.columnDef.footer,
                    getContext()
                  )}
              </th>
            );
          }
        )}
        <VirtualPadding.HeaderCell padding={virtualPaddingRight} />
      </tr>
    </tfoot>
  );
};
