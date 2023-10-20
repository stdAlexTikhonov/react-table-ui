import { rankItem } from '@tanstack/match-sorter-utils';
import { FilterFn, Row } from '@tanstack/react-table';
import { VirtualItem } from '@tanstack/react-virtual';

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const contains = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    row
      .getValue<string | number>(id)?.toString()
      .toLowerCase()
      .trim()
      .includes(filterValue.toString().toLowerCase().trim());

contains.autoRemove = (val: any) => !val;

const notContains = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    !row
      .getValue<string | number>(id)?.toString()
      .toLowerCase()
      .trim()
      .includes(filterValue.toString().toLowerCase().trim());

notContains.autoRemove = (val: any) => !val;

const startsWith = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    row
      .getValue<string | number>(id)?.toString()
      .toLowerCase()
      .trim()
      .startsWith(filterValue.toString().toLowerCase().trim());

startsWith.autoRemove = (val: any) => !val;

const endsWith = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    row
      .getValue<string | number>(id)?.toString()
      .toLowerCase()
      .trim()
      .endsWith(filterValue.toString().toLowerCase().trim());

endsWith.autoRemove = (val: any) => !val;

const equals = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    row.getValue<string | number>(id)?.toString().toLowerCase().trim() ===
        filterValue.toString().toLowerCase().trim();

equals.autoRemove = (val: any) => !val;

const notEquals = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    row.getValue<string | number>(id)?.toString().toLowerCase().trim() !== filterValue.toString().toLowerCase().trim();

notEquals.autoRemove = (val: any) => !val;

const greaterThan = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    !isNaN(+filterValue) && !isNaN(+row.getValue<string | number>(id))
      ? +row.getValue<string | number>(id) > +filterValue
      : row.getValue<string | number>(id)?.toString().toLowerCase().trim() >
          filterValue.toString().toLowerCase().trim();

greaterThan.autoRemove = (val: any) => !val;

const greaterThanOrEqualTo = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) => equals(row, id, filterValue) || greaterThan(row, id, filterValue);

greaterThanOrEqualTo.autoRemove = (val: any) => !val;

const lessThan = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
    !isNaN(+filterValue) && !isNaN(+row.getValue<string | number>(id))
      ? +row.getValue<string | number>(id) < +filterValue
      : row.getValue<string | number>(id)?.toString().toLowerCase().trim() <
      filterValue.toString().toLowerCase().trim();

lessThan.autoRemove = (val: any) => !val;

const lessThanOrEqualTo = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) => equals(row, id, filterValue) || lessThan(row, id, filterValue);

lessThanOrEqualTo.autoRemove = (val: any) => !val;

const notEmpty = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string
) => !!row.getValue<string | number>(id)?.toString().trim();

notEmpty.autoRemove = (val: any) => !val;

const multipleChoice = <TData extends Record<string, any>>(
  row: Row<TData>,
  id: string,
  filterValue: string
) => filterValue.split(',').map(item => item.trim()).includes(row.getValue<string | number>(id)?.toString().trim());

multipleChoice.autoRemove = (val: any) => !val;


export const customFilters = {
  contains,
  notContains,
  startsWith,
  endsWith,
  equals,
  notEquals,
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
  lessThanOrEqualTo,
  notEmpty,
  multipleChoice
}

export const getVirtualItem = <T>(list: T[], item: VirtualItem | T, isVirtual: boolean) => {
  const isVirtualItem = (item: VirtualItem | T): item is VirtualItem => isVirtual;
  return isVirtualItem(item) ? list[item.index]
    : (item as T);
}