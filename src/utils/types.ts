import { ColumnDef } from "@tanstack/react-table";

export type Column = `Col-${number}`;

export type Row = Record<Column, number>;

export type Data<T> = {
    columns: ColumnDef<T, Column>[],
    data: T[],
}