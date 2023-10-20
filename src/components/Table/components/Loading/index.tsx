import React from 'react';

import styles from './Loading.module.scss';

interface Props {
  loading?: boolean;
  errorText?: string;
}

export const Loading = ({ loading, errorText }: Props) => {

  return (
    <div className={styles.wrapper}>
      {loading && <div className={styles.loader} />}
      {errorText && !loading && <div className={styles.error}>{errorText}</div>}
    </div>
  );
};
