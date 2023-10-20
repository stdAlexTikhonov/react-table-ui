import React, { useState, useEffect } from 'react';

import {
  IconDragIndicator24
} from '@components/Icon/IconsList/24';

import {
  IconStackCollapsed16,
  IconStackExpanded16
} from '@components/Icon/IconsList/16'

import { DraggableProvided } from 'react-beautiful-dnd';

import { Column } from '@tanstack/react-table';

import clsx from 'clsx';

import styles from './List.module.scss';
import { Controls } from './Controls';
import { Actions, Dispatcher, State } from '../reducer';
import List from './List';

interface Props {
  column: Column<unknown,unknown>;
  provided: DraggableProvided;
  state: State;
  dispatch: Dispatcher;
  isDragging?: boolean;
}

interface IconProps {
  expanded: boolean;
}

const Icon = ({ expanded }: IconProps) => {
  return expanded ? <IconStackExpanded16 /> : <IconStackCollapsed16 />;
}

export const Item = ({ provided, column, state, dispatch, isDragging }: Props) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (state.expandAll) setExpanded(true);
  }, [state.expandAll]);

  const handleClick = () => {
    setExpanded(prev => !prev);
    if (state.expandAll) dispatch({ type: Actions.SET_EXPAND_ALL, payload: false });
  }

  const handleClickOnDragIndicator = () => setExpanded(false);

  const { columnDef: { header, meta }, id, columns, depth } = column;

  const dragFlag = !expanded || depth === state.levelsLen;

  return (
    <div
      {...provided.draggableProps}
      ref={(el) => {
        provided.innerRef(el);
        if (column.id === state.foundIndex) el?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      <div
        className={clsx(styles.item, isDragging && styles.isDragging, state.foundIndex === id && styles.found)}
      >
        <div
          onClick={handleClickOnDragIndicator}
          className={styles.dragIndicator}
          {...(dragFlag && provided.dragHandleProps)}
        >
          <IconDragIndicator24 htmlColor={dragFlag ? 'grey' : 'lightgrey'} />
        </div>
        {
          columns.length > 0
            && <div 
              onClick={handleClick}
              className={styles.expandIcon} 
              style={{ marginLeft: 10 * depth }}
            >
              <Icon expanded={expanded} />
            </div>
        }
        <span className={styles.columnTitle} onClick={handleClick}>
          {typeof header === 'string' ? header : meta?.title ?? id}
        </span>
        {columns.length === 0 && <Controls column={column} state={state} dispatch={dispatch} />}
      </div>
      {columns.length > 0 && expanded && <List state={state} dispatch={dispatch} droppableId={id} />}
    </div>
  );
}

export const Wrapper = (props: Props) => props.column ? <Item {...props} /> : null;