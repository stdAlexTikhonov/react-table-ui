import { Positions, VirtualColumnsProps } from '@components/Table/types';
import { Table } from '@tanstack/react-table';

export enum FooterMethods {
  Left = 'getLeftFooterGroups',
  Right = 'getRightFooterGroups',
  Center = 'getCenterFooterGroups'
}

export interface FooterProps {
  table: Table<unknown>;
  position?: Positions;
}

export interface VirtualFooterProps extends VirtualColumnsProps {
  table: Table<unknown>;
  position?: Positions;
}
