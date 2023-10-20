import { IconContains24, IconDoesNotContain24, IconDoesNotEquals24, IconEndsWith24, IconEquals24, IconGreaterThan24, IconGreaterThanOrEqualTo24, IconLessThan24, IconLessThanOrEqualTo24, IconStartWith24, IconMultipleChoice24 } from '@components/Icon/IconsList/24';
import { FilterFn } from './types';

export const filterFns = [
  { 
    value: 'contains',
    Icon: IconContains24
  },
  {
    value: 'notContains',
    Icon: IconDoesNotContain24
  },
  {
    value: 'startsWith',
    Icon: IconStartWith24
  },
  {
    value: 'endsWith',
    Icon: IconEndsWith24
  },
  {
    value: 'equals',
    Icon: IconEquals24
  },
  {
    value: 'notEquals',
    Icon: IconDoesNotEquals24
  },
  {
    value: 'greaterThan',
    Icon: IconGreaterThan24
  },
  {
    value: 'greaterThanOrEqualTo',
    Icon: IconGreaterThanOrEqualTo24
  },
  {
    value: 'lessThan',
    Icon: IconLessThan24
  },
  {
    value: 'lessThanOrEqualTo',
    Icon: IconLessThanOrEqualTo24
  },
  {
    value: 'multipleChoice',
    Icon: IconMultipleChoice24
  }
];

export const filtersObj = filterFns.reduce((a, b) => {
  a[b.value] = b;
  return a;
}, { fuzzy: { value: 'fuzzy', title: 'fuzzy', Icon: IconContains24 }} as Record<string, FilterFn>)