import { Dispatch } from 'react';
import { Column, ColumnOrderState, ColumnPinningState, VisibilityState } from '@tanstack/react-table';

export enum Actions {
  SET_VISIBILITY = 'setVisibility',
  SET_PIN = 'setPin',
  SET_ORDER = 'setOrder',
  RESET_ORDER = 'resetOrder',
  SET_FOUND_INDEX = 'setFoundIndex',
  RESET = 'reset',
  SET_EXPAND_ALL = 'SetExpandAll',
  SET_INIT_ORDER = 'SetInitOrder',
  SET_COLUMN_MAP = 'SetColumnMap',
  SET_TITLES = 'SetTitles'
}

export type Title = {
  title: string;
  id: string;
}

export type State = {
  columnVisibility: VisibilityState,
  columnPinning: ColumnPinningState,
  columnOrder: Record<string, ColumnOrderState>,
  initOrder: Record<string, ColumnOrderState>,
  columnsMap: Record<string, Column<unknown, unknown>>,
  titles: Title[],
  foundIndex: string;
  levelsLen: number;
  expandAll: boolean;
};

export type SetExpandAllAction = {
  type: Actions.SET_EXPAND_ALL;
  payload: boolean;
};

export type SetTitlesAction = {
  type: Actions.SET_TITLES;
  payload: Title[];
};

export type SetColumnMapAction = {
  type: Actions.SET_COLUMN_MAP;
  payload: Record<string, Column<unknown, unknown>>,
}

export type SetVisibilityAction = {
  type: Actions.SET_VISIBILITY;
  payload: VisibilityState;
};


export type SetPinAction = {
  type: Actions.SET_PIN;
  payload: ColumnPinningState;
};

export type SetOrder = {
  type: Actions.SET_ORDER;
  payload: Record<string, string[]>;
}

export type SetInitOrder = {
  type: Actions.SET_INIT_ORDER;
  payload: Record<string, string[]>;
}

export type SetFoundIndex = {
  type: Actions.SET_FOUND_INDEX;
  payload: string;
}

export type ResetState = {
  type: Actions.RESET;
  payload: State;
}

export type ResetOrder = {
  type: Actions.RESET_ORDER
}

type Action = SetVisibilityAction | SetPinAction | SetOrder | SetFoundIndex | ResetState | SetExpandAllAction | ResetOrder | SetInitOrder | SetColumnMapAction | SetTitlesAction;

export type Dispatcher = Dispatch<Action>;

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case Actions.SET_VISIBILITY: {
      return {
        ...state,
        columnVisibility: {
          ...state.columnVisibility,
          ...action.payload
        } 
      }
    }
    case Actions.SET_PIN: {
      return {
        ...state,
        columnPinning: {
          ...state.columnPinning,
          ...action.payload
        }
      }
    }
    case Actions.SET_ORDER: {
      return {
        ...state,
        columnOrder: {
          ...state.columnOrder,
          ...action.payload
        }
      }
    }
    case Actions.SET_FOUND_INDEX: {
      return {
        ...state,
        foundIndex: action.payload
      }
    }
    case Actions.SET_EXPAND_ALL: {
      return {
        ...state,
        expandAll: action.payload
      }
    }
    case Actions.SET_INIT_ORDER: {
      return {
        ...state,
        initOrder: action.payload
      }
    }
    case Actions.RESET_ORDER: {
      return {
        ...state,
        columnOrder: state.initOrder
      }
    }
    case Actions.SET_COLUMN_MAP: {
      return {
        ...state,
        columnsMap: action.payload
      }
    }
    case Actions.SET_TITLES: {
      return {
        ...state,
        titles: action.payload
      }
    }
    case Actions.RESET: {
      return action.payload
    }
    default:
      throw Error('Unknown action.');
  }
};
