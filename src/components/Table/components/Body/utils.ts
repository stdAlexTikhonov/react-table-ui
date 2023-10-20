import { Positions } from '@components/Table/types';
import { Row } from '@tanstack/react-table';
import clsx from 'clsx';
import { Types } from '@components/Table/types';

import styles from './Body.module.scss';

export const getCellsMethod = <T>(position: Positions, row: Row<T>) => ({
  [Positions.LEFT]: row.getLeftVisibleCells,
  [Positions.RIGHT]: row.getRightVisibleCells,
  [Positions.CENTER]: row.getCenterVisibleCells
}[position]);

const classNameTypeMap: Record<Types, string> = {
  [Types.ERROR]: styles.error,
  [Types.ERROR_LIGHT]: styles.error_light,
  [Types.WARNING]: styles.warning,
  [Types.WARNING_LIGHT]: styles.warning_light,
  [Types.SUCCESS]: styles.success,
  [Types.SUCCESS_LIGHT]: styles.success_light,
  [Types.DISABLED]: ''
}

const classNameHoverTypeMap: Record<Types, string> = {
  [Types.ERROR]: styles.error_hover,
  [Types.ERROR_LIGHT]: styles.error_light_hover,
  [Types.WARNING]: styles.warning_hover,
  [Types.WARNING_LIGHT]: styles.warning_light_hover,
  [Types.SUCCESS]: styles.success_hover,
  [Types.SUCCESS_LIGHT]: styles.success_light_hover,
  [Types.DISABLED]: ''
}

const classNameTypeSelectedMap: Record<Types, string> = {
  [Types.ERROR]: styles.error_selected,
  [Types.ERROR_LIGHT]: styles.error_light_selected,
  [Types.WARNING]: styles.warning_selected,
  [Types.WARNING_LIGHT]: styles.warning_light_selected,
  [Types.SUCCESS]: styles.success_selected,
  [Types.SUCCESS_LIGHT]: styles.success_light_selected,
  [Types.DISABLED]: ''
}

function isArray(rowColors: `${Types}`[] | Record<number, `${Types}`> | undefined): rowColors is `${Types}`[] {
  return Array.isArray(rowColors);
}

export const getClassNames = (row: Row<unknown>, rowIndex: number, selection: boolean, rowColors?: `${Types}`[] | Record<number, `${Types}`>) => {

  const calculatedIndex = isArray(rowColors) ? rowIndex % rowColors.length : rowIndex;

  return clsx(
    selection && styles.row_base_hover,
    selection && row.getIsSelected() && styles.row_base_selected,
    rowColors && classNameTypeMap[rowColors[calculatedIndex]],
    selection && rowColors && classNameHoverTypeMap[rowColors[calculatedIndex]],
    (selection && row.getIsSelected() && rowColors) && classNameTypeSelectedMap[rowColors[calculatedIndex]]
  )
}

export const getRowSpan = (compounds: Record<string, { value: number | null }>, columnId: string) => {
  return compounds ? compounds[columnId] === undefined ? 1 : compounds[columnId].value : 1;
}