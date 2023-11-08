import { ColumnDef } from '@tanstack/react-table';
import { Row, Data, Column } from './types';
export declare const makeColumn: <T>(column: ColumnDef<T, `Col-${number}`>, options: ColumnDef<T, `Col-${number}`>) => ColumnDef<T, `Col-${number}`>;
export declare const makeRow: (cols: number) => Row;
export declare const makeData: (len: number, cols?: number) => Data<Row>;
