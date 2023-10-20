import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './ContextMenu.module.scss';

import useComponentVisible from '../../hooks/useComponentVisible';

export const ContextMenu = ({
  show,
  top,
  left,
  onCopy,
  onPaste,
  onClose
}: {
  show: boolean;
  onClose: () => void;
  top: number;
  left: number;
  onCopy: () => void;
  onPaste: (e: any) => void;
}) => {
  const { t } = useTranslation();
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const isMacOS = window.navigator.userAgent.includes('Mac');
  const CTRL_OR_CMD_KEY = isMacOS ? 'Cmd' : 'Ctrl';

  const visible = navigator.clipboard && show;

  useEffect(() => {
    setIsComponentVisible(true);
  }, [visible]);

  useEffect(() => {
    if (!isComponentVisible) {
      onClose();
    }
  }, [isComponentVisible]);

  return (
    isComponentVisible && visible ? (
      <div ref={ref}>
        <div style={{ top, left }} className={styles.menu}>
          <div onClick={onCopy} className={styles['menu-item']}>
            <span className={styles.label}>{t('contextMenu.copy')}</span>
            <div className={styles.hint}>{`${CTRL_OR_CMD_KEY} + C`}</div>
          </div>
          <div onClick={onPaste} className={styles['menu-item']}>
            <span className={styles.label}>{t('contextMenu.paste')}</span>
            <div className={styles.hint}>{`${CTRL_OR_CMD_KEY} + V`}</div>
          </div>
        </div>
      </div>
    ) : null
  );
};
