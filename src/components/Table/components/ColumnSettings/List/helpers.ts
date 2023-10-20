import { CSSProperties } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';

export const reorder = (list: string[], startIndex: number, endIndex: number): string[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const  getStyle = (provided: DraggableProvided, style?: CSSProperties) => {
  const combined = {
    ...style,
    ...provided.draggableProps.style
  };
  return combined;
}
