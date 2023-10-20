import { Dispatch } from 'react';

export enum Actions {
  SET_INIT_FILTERS = 'SetInitFilters',
  SET_FILTER = 'SetFilter'
}

export type State = Record<string, string>;

export type SetInitFilters = {
  type: Actions.SET_INIT_FILTERS;
  payload: Record<string, string>;
}

export type SetFilter = {
  type: Actions.SET_FILTER;
  payload: Record<string, string>
}

type Action = SetInitFilters | SetFilter;

export type Dispatcher = Dispatch<Action>;

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case Actions.SET_INIT_FILTERS: {
      return action.payload;
    }
    case Actions.SET_FILTER: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      throw Error('Unknown action.');
  }
};
