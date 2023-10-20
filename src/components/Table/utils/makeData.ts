import { Status, Fields, Formation } from '../types';
import { SortingState, ColumnSort, PaginationState } from '@tanstack/react-table';
import _ from 'lodash';

const brigadiers = [
  'Иванов Крилл Федорович',
  'Петров Семён Олегович',
  'Олегов Борис Петрович',
  'Федоров Сергей Иванович',
  'Суркова Ольга Ивановна',
  'Сергев Фёдор Кириллович',
  'Борисов Олег Семёнович',
  'Семёнов Пётр Босрисович',
  'Кириллов Иван Сергеевич'
];

const numGenerate = (num: number) => Math.floor(Math.random() * num) + 1;

const formationMapping = {
  [Fields.FormationNum]: () => numGenerate(100),
  [Fields.Brigadier]: () => brigadiers[numGenerate(8)],
  [Fields.Shift]: () => numGenerate(40),
  [Fields.Visits]: () => numGenerate(1000),
  [Fields.Progress]: () => numGenerate(100).toFixed(2),
  [Fields.StatusKey]: () => [Status.FORMING, Status.PRODUCED, Status.CERTIFIED][numGenerate(2)]
};

const newFormation = (index: number): Formation => {
  return Object.values(Fields).reduce((acc, item) => ({ ...acc, [`${item}-${index}`]: formationMapping[item]()}), {})
};

export const makeData = (len: number, fieldCount?: number) => {
  return Array(len)
    .fill(0)
    .map((): Formation =>
      fieldCount 
        ? Array(fieldCount).fill(0).map((_, index) => newFormation(index)).reduce((a,b) => ({ ...a, ...b }), {})
        : newFormation(0));
};

const data = makeData(1000);

//simulates a backend api
export const fetchData = (
  start: number,
  size: number,
  sorting: SortingState,
  pagination?: PaginationState
) => {
  const dbData = [...data]
  if (sorting.length) {
    const sort = sorting[0] as ColumnSort
    const { id, desc } = sort as { id: keyof Formation; desc: boolean }
    dbData.sort((a, b) => {
      const aVal = a[id] ?? 0;
      const bVal = b[id] ?? 0;
      if (desc) {
        return aVal < bVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    });
  }

  let chunked = _.chunk(dbData, size);
  if (pagination) chunked = chunked.slice(pagination?.pageIndex);
  const res = chunked[start/size];

  return Promise.resolve({
    data: res,
    meta: {
      totalRowCount: dbData.length
    }
  });
}

