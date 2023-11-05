export type Column = `Col-${number}`;

export type Row = Record<Column, number>;

export type Data = {
    columns: Column[],
    data: Row[],
}