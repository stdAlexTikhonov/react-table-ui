import React, { RefObject, useRef, useState, useEffect, useMemo } from 'react';

import Table, {
  makeData,
  useTable,
  expandedColumns,
  columns,
  FilterState,
  columnGroups,
  columnGroupsVirtualization,
  SortingState,
  PaginationState,
  columnsEn
} from '../index';

import { Formation, FormationApiResponse } from '../types';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import { fetchData, delay, getMultipleSelect } from '../utils';


export default {
  title: 'Table/Table/Stories',
  parameters: {
    chromatic: { disableSnapshot: true },
  }
};

/*
 * Таблица с виртуализацией
 * Виртуализация может быть как горизонтальная, так и вертикальная для включения используйте:
 * 
 *  - meta: { enableRowVirtualization: true } - для вертикальной
 *  - meta: { enableColumnVirtualization: true } - для горизонтальной
 * 
*/
export const TableVirtualization = () => {
  const [largeRows] = useState(makeData(1000, 10));
  
  const largeColumns = useMemo(() => Object.keys(largeRows[0]).map(key => {
    return { accessorKey: key };
  }), []);
  
  const table = useTable({
    columns: largeColumns,
    data: largeRows,
    meta: {
      enableColumnVirtualization: true,
      enableRowVirtualization: true,
      editable: true,
      size: 'S'
    },
    compound: 'status-0'
  });

  return <Table.Root>
    <Table.ColumnSettings table={table} />
    <Table.TableComponent table={table} height={500} width={1500} />
  </Table.Root>
};
TableVirtualization.storyName = 'Таблица TableVirtualization';

