import React, { useState } from 'react';
import { Table, useTable, FilterState, makeData, columns } from '../../..';
import { Formation } from '../../types'

export const TableFiltersWithBackend = () => {
  const [base] = useState(makeData(10));
  const [data, setData] = useState(base);

  const handleFilterChange = ({ id, mode, value}: FilterState) => {

    if (mode === 'contains') {
      if (value.length > 0) {
        const filtered = base.filter(row => row?.[id as keyof Formation]?.toString().includes(value));
        setData(filtered);
      } else setData(base);
     
    } else if (mode === 'multipleChoice') {
      if (value.length > 0) {
        const values = value.split(',');
        const filtered = base.filter(row => {
          const currentValue = row?.[id as keyof Formation]?.toString();
          return values.some(value => currentValue?.includes(value));
        });
        setData(filtered);
      } else setData(base);
    }
  }

  const handleLoadUniqueValues = (column: string) => {
    const res = data.reduce((acc, row) => {
      return acc.concat([row[column as keyof Formation]])
    }, [] as any);

    const uniqueValues = Array.from(new Set(res));

    return Promise.resolve(uniqueValues as string[]);
  }
  
  const table = useTable<Formation>({
    columns,
    data,
    enableColumnFilters: true,
    meta: {
      onFilterChange: handleFilterChange,
      loadUniqueValues: handleLoadUniqueValues
    }
  });

  return <Table.Root>
    <div><Table.ColumnSettings table={table} /></div>
    <Table.TableComponent table={table} height={400} width={'100%'} />
  </Table.Root>
};