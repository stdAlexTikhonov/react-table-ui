export interface State {
  leftNew: number;
  topNew: number;
  widthNew: number;
  heightNew: number;
  showContextMenu: boolean;
  contextTop: number;
  contextLeft: number;
  firstColumn: number;
  lastColumn: number;
  firstRow: number;
  lastRow: number;
  enterFlag: boolean;
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  showBorder: boolean;
  copied: boolean;
  positions: Record<string, number>;
  selectionTop: Record<string, number>;
  firstColumnName: string;
  selectionInProgress: boolean;
}

export enum Actions {
  SET_CELL = 'setCell',
  SET_SHOW_CONTEXT_MENU = 'setShowContextMenu',
  SET_CONTEXT = 'setContext',
  SET_FIRST_CELL = 'setFirstCell',
  SET_LAST_CELL = 'setLastCell',
  TOGGLE_ENTER = 'toggleEnter',
  RESET_ENTER = 'resetEnter',
  SET_ENTER = 'setEnter',
  RESET = 'reset',
  RESET_CELL = 'resetCell',
  SET_COPIED = 'setCopied',
  RESET_COPIED = 'resetCopied',
  SET_POSITION = 'setPosition',
  SET_TOP_POSITION = 'setTopPosition',
  SET_SELECTION = 'setSelection'
}

export const initialState: State = {
  leftNew: 0,
  topNew: 0,
  widthNew: 0,
  heightNew: 0,
  showContextMenu: false,
  contextTop: 0,
  contextLeft: 0,
  firstColumn: -1,
  lastColumn: -1,
  firstRow: -1,
  lastRow: -1,
  enterFlag: true,
  top: -1,
  left: -1,
  bottom: -1,
  right: -1,
  width: 0,
  height: 0,
  showBorder: false,
  copied: false,
  positions: {},
  selectionTop: {},
  firstColumnName: '',
  selectionInProgress: false
} as const;

type SetSelectionAction = {
  type: typeof Actions.SET_SELECTION;
  payload: boolean;
};

type SetTopPositionAction = {
  type: typeof Actions.SET_TOP_POSITION;
  payload: {
    [x: number]: number
  };
};

type SetPositionAction = {
  type: typeof Actions.SET_POSITION;
  payload: {
   [x: number]: number
  };
};

type SetCopiedAction = {
  type: typeof Actions.SET_COPIED;
};

type ResetCopiedAction = {
  type: typeof Actions.RESET_COPIED;
};

type ResetCellAction = {
  type: typeof Actions.RESET_CELL;
};

type SetCellAction = {
  type: typeof Actions.SET_CELL;
  payload: {
    top: number;
    left: number;
    height: number;
    bottom: number;
    right: number;
    leftNew: number;
    topNew: number;
    widthNew: number;
    heightNew: number;
  };
};

type SetShowContextMenuAction = {
  type: typeof Actions.SET_SHOW_CONTEXT_MENU;
  payload: boolean;
};

type SetContextAction = {
  type: typeof Actions.SET_CONTEXT;
  payload: {
    contextLeft: number;
    contextTop: number;
    showContextMenu: boolean;
  };
};

type SetFirstCellAction = {
  type: typeof Actions.SET_FIRST_CELL;
  payload: {
    firstColumn: number;
    firstColumnName: string;
    firstRow: number;
  };
};

type SetLastCellAction = {
  type: typeof Actions.SET_LAST_CELL;
  payload: {
    lastColumn: number;
    lastRow: number;
  };
};

type ToggleEnterAction = {
  type: typeof Actions.TOGGLE_ENTER;
};

type ResetEnterAction = {
  type: typeof Actions.RESET_ENTER;
};

type SetEnterAction = {
  type: typeof Actions.SET_ENTER;
};

type ResetAction = {
  type: typeof Actions.RESET;
};


export type Action = ResetAction | SetEnterAction | ResetEnterAction | ToggleEnterAction | SetLastCellAction | SetFirstCellAction | SetContextAction | SetShowContextMenuAction | SetCellAction | ResetCellAction | ResetCopiedAction | SetCellAction | SetPositionAction | SetCopiedAction | SetTopPositionAction | SetSelectionAction;

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case Actions.SET_SELECTION:
      return {
        ...state,
        selectionInProgress: action.payload
      }
    case Actions.SET_TOP_POSITION:
      return {
        ...state,
        selectionTop: {
          ...state.selectionTop,
          ...action.payload
        }
      };
    case Actions.SET_POSITION:
      return {
        ...state,
        positions: {
          ...state.positions,
          ...action.payload
        }
      };
    case Actions.SET_COPIED:
      return {
        ...state,
        copied: true
      };
    case Actions.RESET_COPIED:
      return {
        ...state,
        copied: false
      };
    case Actions.RESET_CELL:
      return {
        ...state,
        top: -1,
        left: -1,
        with: 0,
        height: 0,
        bottom: -1,
        right: -1
      };
    case Actions.SET_CELL:
      return {
        ...state,
        ...action.payload
      };
    case Actions.SET_SHOW_CONTEXT_MENU:
      return {
        ...state,
        showContextMenu: action.payload
      };
    case Actions.SET_CONTEXT:
      return {
        ...state,
        ...action.payload
      };

    case Actions.SET_FIRST_CELL:
      return {
        ...state,
        firstColumnName: action.payload.firstColumnName,
        firstColumn: action.payload.firstColumn,
        firstRow: action.payload.firstRow,
        showContextMenu: false,
        showBorder: false
      };
    case Actions.SET_LAST_CELL:
      return {
        ...state,
        lastColumn: action.payload.lastColumn,
        lastRow: action.payload.lastRow,
        showBorder: true
      };
    case Actions.TOGGLE_ENTER:
      return {
        ...state,
        enterFlag: !state.enterFlag
      };
    case Actions.RESET_ENTER:
      return {
        ...state,
        enterFlag: false
      };
    case Actions.SET_ENTER:
      return {
        ...state,
        enterFlag: true
      };
    case Actions.RESET:
      return initialState;
    default:
      throw Error('Unknown action.');
  }
};

