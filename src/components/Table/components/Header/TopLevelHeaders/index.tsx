import React, { useMemo } from 'react';
import { TopLevelHeadersProps } from '../types';
import { HeaderGroup } from '@tanstack/react-table';
import { TopLevelHeader } from './TopLevelHeader';
import _get from 'lodash/get';

import styles from './TopLevelHeaders.module.scss';

export const TopLevelHeaders = ({ table, headerRef }: TopLevelHeadersProps) => {
  const headerGroups = table.getCenterHeaderGroups();
  const { size, border = true } = _get(table, 'options.meta') || {};
  const widths = table.getCenterVisibleLeafColumns().map(item => item.getSize());

  const transformedHeaderGroups = useMemo(() => {
    if (headerGroups.length > 1) {
      const topGroups = headerGroups.slice(0, -1);
      return topGroups.map((headerGroup: HeaderGroup<unknown>) => {
        const { headers } = headerGroup;
        return ({
          ...headerGroup,
          headers: headers
            .reduce((acc, header, headerIndex) => {

              return ({ ...acc, [`${header.id}`]: Array.from({ length: header.colSpan }, (_, index) => index === 0 && !header.id.endsWith(header.column.id)
                ? header
                : ({
                  ...header,
                  isPlaceholder: index > 0,
                  column: {
                    id: `_${headerIndex}_${index}`,
                    columnDef: {
                      meta: {
                        headerStyle: header.column.columnDef.meta?.headerStyle,
                        borderLeft: header.column.columnDef.meta?.borderLeft
                      }
                    }
                  }
                })
              ) });

            }, {})
        });
      })
    }
    else return []
  }, [headerGroups]);

  return <div className={styles.root}>
    <div className={styles.overlay} />
    {transformedHeaderGroups.map((item,index) =>
      <TopLevelHeader
        key={index}
        headersObject={item.headers}
        ref={headerRef[index]}
        widths={widths}
        size={size ?? 'S'}
        border={border}
      />
    )}
  </div>
};
