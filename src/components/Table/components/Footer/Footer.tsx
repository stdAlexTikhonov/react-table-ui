import React from 'react';

import { Positions } from '@components/Table/types';
import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import _get from 'lodash/get';

import { FooterProps } from './types';

import styles from './Footer.module.scss';

import { getFooterMethod } from './utils';

export const Footer = ({
  table,
  position = Positions.CENTER
}: FooterProps) => {
  const { border = true } = _get(table, 'options.meta') || {};
  const getGroups = getFooterMethod(position, table);
  const footerRows = getGroups();
  const footerGroup = footerRows[0];

  return (
    <tfoot className={styles.tfoot}>
      <tr key={footerGroup.id}>
        {(footerGroup.headers).map(
          ({ id, colSpan, getSize, isPlaceholder, getContext, column, index }, i) => {

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
                  i !== 0 && border && styles.border
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
      </tr>
    </tfoot>
  );
};

