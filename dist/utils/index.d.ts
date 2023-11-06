import { ColumnDef } from '@tanstack/react-table';
import { Row, Data } from './types';
export declare const makeColumn: <T>(column: ColumnDef<T>, options: ColumnDef<T>) => ColumnDef<T>;
export declare const makeRow: (cols: number) => Row;
export declare const makeData: (len: number, cols?: number) => Data<Row>;
