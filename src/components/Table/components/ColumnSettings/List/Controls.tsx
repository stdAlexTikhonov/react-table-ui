import React from 'react';
import { Button } from '@components/Button';
import {
  IconPushPin24,
  IconPushPinRight24,
  IconPushPinFilled24,
  IconPushPinRightFilled24,
  IconVisibility24,
  IconVisibilityOff24
} from '@components/Icon/IconsList/24';
import { Column } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import styles from './List.module.scss';
import { Actions, Dispatcher, State } from '../reducer';

interface Props {
  column: Column<unknown, unknown>;
  state: State;
  dispatch: Dispatcher;
}

export const Controls = ({ column, state, dispatch }: Props) => {
  const { t } = useTranslation();
  const { columnPinning, columnVisibility } = state;
  const pinnedLeft = columnPinning.left?.includes(column.id);
  const pinnedRight = columnPinning.right?.includes(column.id);

  const IconComponent = columnVisibility[column.id]
    ? IconVisibility24
    : IconVisibilityOff24;

  const toggleVisibility = () => {
    dispatch({ type: Actions.SET_VISIBILITY, payload: { [column.id]: !columnVisibility[column.id] }});
  }

  const handlePinLeft = () => {
    if (pinnedLeft) {
      const leftNew = columnPinning.left?.filter(item => item !== column.id);
      dispatch({ type: Actions.SET_PIN, payload: { ...columnPinning, left: leftNew }});
    } else {
      const leftNew = columnPinning.left ? columnPinning.left.concat([column.id]) : [column.id];
      dispatch({ type: Actions.SET_PIN, payload: { ...columnPinning, left: leftNew }});
    }
  }

  const handlePinRight = () => {
    if (pinnedRight) {
      const rightNew = columnPinning.right?.filter(item => item !== column.id);
      dispatch({ type: Actions.SET_PIN, payload: { ...columnPinning, right: rightNew }});
    } else {
      const rightNew = columnPinning.right ? columnPinning.right.concat([column.id]) : [column.id];
      dispatch({ type: Actions.SET_PIN, payload: { ...columnPinning, right: rightNew }});
    }
  }

  return <>
    <Button
      className={styles.btn}
      title={(columnVisibility[column.id] ? t('columnSettings.hide') : t('columnSettings.show')) as string}
      onClick={toggleVisibility}
      variant="text"
      size="s"
    >
      <IconComponent color="primary" />
    </Button>
    {column.getCanPin() &&
      <Button
        className={styles.btn}
        title={pinnedLeft ? t('columnSettings.unpin') : t('columnSettings.pin')}
        onClick={handlePinLeft}
        variant="text"
        disabled={pinnedRight}
        size="s"
      >
        {pinnedLeft ? <IconPushPinFilled24 /> : <IconPushPin24 />}
      </Button>}
    {column.getCanPin() &&
      <Button
        className={styles.btn}
        title={pinnedRight ? t('columnSettings.unpin') : t('columnSettings.pin')}
        onClick={handlePinRight}
        variant="text"
        disabled={pinnedLeft}
        size="s"
      >
        {pinnedRight ? <IconPushPinRightFilled24 /> : <IconPushPinRight24 />}
      </Button>}
  </>;
  
}

