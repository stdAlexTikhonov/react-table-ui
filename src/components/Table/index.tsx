import { Root } from './components/Root';
import { Table as TableComponent } from './components/Table';
import { ColumnSettings } from './components/ColumnSettings'
import { GlobalFilter } from './components/GlobalFilter';
export { Types } from './types';
export { FooterCell } from './components/FooterCell';
export { Cell } from './components/Cell';
export { useTable } from './hooks/useTable';

/*
* Экспорт tanstack нужен для того чтобы использоваться его типы без устаноки tanstack на проекте!
* Типы могут понадобиться при создании конфигурационного объекта таблицы (useTable([config]))
*/
export * from '@tanstack/react-table';

const Table = {
  Root,
  TableComponent,
  ColumnSettings,
  GlobalFilter
};
export * from './utils';

export * from './examples';

export default Table;
