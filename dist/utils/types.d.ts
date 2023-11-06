import { ColumnDef } from "@tanstack/react-table";
type Column = `Col-${number}`;
export type Row = Record<Column, number>;
export type Data<T> = {
    columns: ColumnDef<T>[];
    data: T[];
};
export {};
