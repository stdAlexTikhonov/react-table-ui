import { Types } from '../../types';
import { CellContext } from '@tanstack/react-table';

export interface CellProps<T> extends CellContext<T, unknown> {
  type?: `${Types}`;
}