import { State } from '@components/Table/hooks/reducer';

interface RangeHandlers {
  onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export interface RangeSelectionProps {
  rangeHandlers: RangeHandlers;
  state: Partial<State>;
}