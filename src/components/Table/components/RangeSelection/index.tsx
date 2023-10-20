import React from 'react';

import styles from './RangeSelection.module.scss';

import clsx from 'clsx';
import { RangeSelectionProps } from './types';

export const RangeSelection = ({ rangeHandlers, state }: RangeSelectionProps) => {
  const { showBorder , copied, heightNew, widthNew, topNew, leftNew } = state;
  return <div
    className={clsx(
      styles.range,
      showBorder && styles.withBorder,
      copied && styles.copied
    )}
    {...rangeHandlers}
    style={{
      height: heightNew,
      width: widthNew,
      top: topNew,
      left: leftNew
    }}
  />;
};