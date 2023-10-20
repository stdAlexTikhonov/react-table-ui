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
 * Таблица с редактируемыми полями
 * Для включения возможности изменения, выделения, копирования и вставки укажите meta свойство editable
 * 
 * Пример:
 *  - meta: { editable: true }
*/
export const TableEditable = () => {
  const [data] = useState(makeData(50));
  
  const table = useTable({
    columns,
    data,
    meta: {
      editable: true,
      size: 'L'
    }
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} width={'100%'} height={500} />
  </Table.Root>
};
TableEditable.storyName = 'Таблица TableEditable';

