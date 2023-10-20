import { State } from '@components/Table/hooks/reducer';
import { Positions, VirtualColumnsProps, VirtualRowsProps } from '@components/Table/types';
import { Table } from '@tanstack/react-table';


export const enum CellMethods {
  LEFT = 'getLeftVisibleCells',
  RIGHT = 'getRightVisibleCells',
  CENTER = 'getCenterVisibleCells'
}

type MouseHandler<T> = (e: React.MouseEvent<T, MouseEvent>, position?: Positions) => void;

interface TableHandlers {
  onCopy: () => void;
  onContextMenu: MouseHandler<HTMLTableSectionElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTableSectionElement>) => void;
  onMouseMove: MouseHandler<HTMLTableSectionElement>;
  onClick: MouseHandler<HTMLTableSectionElement>;
}

export interface CellHandlers {
  onMouseUp: MouseHandler<HTMLTableCellElement>;
  onMouseMove: MouseHandler<HTMLTableCellElement>;
  onMouseDown: MouseHandler<HTMLTableCellElement>;
}

interface RangeHandlers {
  onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export interface CopyPasteProps {
  state: State;
  tableHandlers: TableHandlers;
  cellHandlers: CellHandlers;
  rangeHandlers: RangeHandlers;
  onCloseMenu: () => void;
}

export interface BodyProps extends CopyPasteProps {
  table: Table<unknown>;
  position?: Positions;
}

export interface VirtualBodyProps extends VirtualColumnsProps, BodyProps, VirtualRowsProps {}
export interface VerticalVirtualBodyProps extends BodyProps, VirtualRowsProps {}