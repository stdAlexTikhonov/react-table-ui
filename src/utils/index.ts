import { ColumnDef } from '@tanstack/react-table';
import { Row, Data, Column } from './types';

const numGenerate = (num: number) => Math.floor(Math.random() * num) + 1;

const makeBaseColumn = (_: number, num: number): ColumnDef<Row, Column> => ({
    accessorKey: `Col-${num}`
});

export const makeColumn = <T>(column: ColumnDef<T, Column>, options: ColumnDef<T, Column>): ColumnDef<T, Column> => ({
    ...column,
    ...options
});

export const makeRow = (cols: number): Row => Array(cols).fill(0).reduce((a, b, i) => ({...a, [`Col-${i}`]: numGenerate(cols - i) }), {});

export const makeData = (len: number, cols: number = 10): Data<Row> => ({
    columns: Array(cols).fill(0).map(makeBaseColumn),
    data: Array(len).fill(0).map(_ => makeRow(cols))
})
