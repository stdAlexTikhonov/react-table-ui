import {VirtualItem, Virtualizer} from '@tanstack/react-virtual'

export enum Status {
  FORMING = 'формирование',
  PRODUCED = 'предъявлено',
  CERTIFIED = 'выпущен сертификат'
}

export enum Positions {
  LEFT = 'Left',
  CENTER = 'Center',
  RIGHT = 'Right'
}

export enum Fields {
  FormationNum = 'formationNum',
  Brigadier = `brigadier`,
  Shift = `shift`,
  Visits = `visits`,
  Progress = `progress`,
  StatusKey = `status`,
}

export type Formation = {
  [key: string]: number | null | string | Status | Formation[];
};

export type FormationApiResponse = {
  data: Formation[]
  meta: {
    totalRowCount: number
  }
}

export enum Types {
  SUCCESS_LIGHT = 'success_light',
  WARNING_LIGHT = 'warning_light',
  ERROR_LIGHT = 'error_light',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DISABLED = 'disabled'
}

export enum Sizes {
  S = 32,
  M = 40,
  L = 56
}

export type VirtualColumnsProps = {
  virtualColumns: VirtualItem[];
  virtualPaddingLeft: number;
  virtualPaddingRight: number;
}

export type VirtualRowsProps = {
  virtualRows: VirtualItem[];
  paddingTop: number;
  paddingBottom: number;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
}

export type Value = number | null;

export type Compound = Record<string, { value: Value, virtualValue?: Value }>