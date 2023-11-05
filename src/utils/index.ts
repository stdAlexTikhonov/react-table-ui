import { Column, Row, Data } from './types';

const numGenerate = (num: number) => Math.floor(Math.random() * num) + 1;

const makeColumn = (_: number, num: number): Column => `Col-${num}`;

export const makeRow = (cols: number): Row => Array(cols).fill(0).reduce((a, b, i) => ({...a, [`Col-${i}`]: numGenerate(cols - i) }), {});

export const makeData = (len: number, cols: number = 10): Data => ({
    columns: Array(cols).fill(0).map(makeColumn),
    data: Array(len).fill(0).map(_ => makeRow(cols))
})
