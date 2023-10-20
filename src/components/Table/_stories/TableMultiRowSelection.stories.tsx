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
 * Таблица с множественным выбором
 * 
 * Импортируйте метод getMultipleSelect из библиотеки и добавте результат выполнения этой функции в колонки
 * 
 *  - const multipleSelect = getMultipleSelect();
 *  - columns: [multipleSelect, ...columns]
 * 
 * Включите выбор строки
 *  
 *  - enableRowSelection: true
 * 
*/
export const TableMultiRowSelection = () => {
  const [data] = useState(makeData(10));
  const multipleSelect = getMultipleSelect<Formation>();
  
  const table = useTable({
    columns: [multipleSelect, ...columns],
    data,
    enableMultiRowSelection: true,
    meta: {
      enableFooter: true
    }
  });

  return <Table.Root>
    <Table.TableComponent table={table} width={'100%'} />
  </Table.Root>
};
TableMultiRowSelection.storyName = 'Таблица TableMultiRowSelection';

