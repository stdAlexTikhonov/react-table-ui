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
 * Таблица с возможностью выбора строки
 * Для того чтобы включить выбор строки включите свойство enableRowSelection
 * 
 *  - enableRowSelection: true
 * 
 * Есть возможноть контролиовать выбор через state и onRowSelectionChange
 * 
 *  - const [selection, setSelection] = useState<RowSelectionState>({})
 * 
 *  - state: { rowSelection: selection }
 *  - onRowSelectionChange: setSelection
 * 
*/
export const TableRowSelection = () => {
  const [data] = useState(makeData(10));
  
  const table = useTable({
    columns,
    data,
    enableRowSelection: true
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};
TableRowSelection.storyName = 'Таблица TableRowSelection';

