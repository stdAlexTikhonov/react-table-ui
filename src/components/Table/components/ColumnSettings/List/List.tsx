import React, {useMemo} from 'react';
import { DragDropContext, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import { reorder } from './helpers';
import { Wrapper } from './Item';
import { Draggable } from 'react-beautiful-dnd';

import { Dispatcher, State, Actions } from '../reducer';
interface Props {
  droppableId: string;
  state: State;
  dispatch: Dispatcher;
}

const List = ({ droppableId, state, dispatch }: Props) => {
  const localOrder = useMemo(() => state.columnOrder[droppableId].filter((v) => v !== 'select'), [state.columnOrder, droppableId]);

  const { columnsMap } = state;

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    
    const newItems = reorder(
      localOrder,
      result.source.index,
      result.destination.index
    );

    const firstIndex = state.columnOrder[droppableId].indexOf(localOrder[0]);
    const spliced = Array.from(state.columnOrder[droppableId]);
    spliced.splice(firstIndex, newItems.length, ...newItems);

    dispatch({ type: Actions.SET_ORDER, payload: { [droppableId]: spliced }});
    dispatch({ type: Actions.SET_FOUND_INDEX, payload: '' });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId={droppableId}
        renderClone={(provided, snapshot, rubric) => (
          <Wrapper
            provided={provided}
            isDragging={snapshot.isDragging}
            column={columnsMap[localOrder[rubric.source.index]]}
            state={state}
            dispatch={dispatch}
          />
        )}
      >
        {provided => (
          <div
            ref={provided.innerRef}
          >
            {localOrder.map((item, index) => {
              return (
                <Draggable draggableId={item} index={index} key={item}>
                  {provided => <Wrapper
                    provided={provided}
                    column={columnsMap[item]}
                    state={state}
                    dispatch={dispatch}
                  />}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default List;
