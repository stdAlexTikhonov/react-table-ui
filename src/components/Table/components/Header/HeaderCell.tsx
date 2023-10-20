import React, { useState } from 'react';

import { SortDirection, flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import { IconArrowUpward16, IconArrowDownward16 } from '@components/Icon/IconsList/16';
import { InnerProps } from './types';

import styles from './Header.module.scss';

import { Filter } from '../Filter';

import _get from 'lodash/get';
import { Sizes } from '@components/Table/types';

const positionMap: Record<string, string> = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center'
}

interface Props {
  value: SortDirection | false
}

const SortIcon = ({ value }: Props) => {
  return  value ? value === 'asc' ? <IconArrowDownward16 /> : <IconArrowUpward16 /> : null
}

export const HeaderCell = ({ header, table, onFilterChange, filterType, virtual, isNumber }: InnerProps) => {
  const { column: { columnDef: { meta, header: innerHeader }, id }, index } = header;
  const { border = true, size } = _get(table, 'options.meta') || {};
  const ifHeaderIdSelect = header.id === 'select';
  const [focused, setFocused] = useState(false);

  const sortingState = header.column.getIsSorted();

  const justifyContent = meta?.textAlign ? positionMap[meta?.textAlign] : isNumber ? 'flex-end' : 'flex-start';

  const borderLeft = meta?.borderLeft ?? (index !== 0 && border);
  const borderBottom = meta?.borderBottom ?? border;

  return <th
    data-index={index}
    title={typeof innerHeader === 'string' ? innerHeader : meta?.title ?? id}
    {...{
      key: header.id,
      colSpan: virtual ? 1 : header.colSpan,
      style: meta?.headerStyle
    }}
    className={styles.cell}>
    {header.isPlaceholder ? null : (
      <div
        style={{
          width: header.getSize(),
          height: table.options.enableColumnFilters ? Sizes[size ?? 'S'] * 2 : Sizes[size ?? 'S']
        }}
        className={clsx(styles.wrapperCell, borderLeft && styles.border)}
      >
        <div
          className={clsx(styles.innerCell, borderBottom && styles.borderBottom,(focused || sortingState) && styles.active)}
          style={{ justifyContent }} onClick={header.column.getToggleSortingHandler()}
        >
          {ifHeaderIdSelect 
            ? <div style={{ height: Sizes[size ?? 'S']}} className={styles.wrapperCell}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
            : <span
              style={meta?.headerStyle}
              className={clsx(styles.text, styles[`textPadding${size ?? 'S'}`])}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </span>}
          
          {!ifHeaderIdSelect && <div className={styles.sortIcon} style={{ height: Sizes[size ?? 'S']}}><SortIcon value={sortingState} /></div>}
          {sortingState && <div className={styles.underline} />}
        </div>
        {!ifHeaderIdSelect && (
          <div
            {...{
              onMouseDown: header.getResizeHandler(),
              onTouchStart: header.getResizeHandler(),
              className: clsx(
                styles.resizer,
                header.column.getIsResizing() && styles.isResizing
              )
            }}
          />
        )}

        {table.options.enableColumnFilters && (
          <Filter
            column={header.column}
            table={table}
            onInnerFilterChange={onFilterChange}
            filterType={filterType}
            focused={focused}
            setFocused={setFocused}
            borderBottom={Boolean(borderBottom)}
          />
        )}
      </div>
    )}
  </th>;
};


