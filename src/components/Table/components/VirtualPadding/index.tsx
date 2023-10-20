import React from 'react';
import styles from './VirtualPadding.module.scss';

interface VirtualPaddingProps {
  padding?: number;
}

const HeaderCell: React.FC<VirtualPaddingProps> = ({ padding }) =>
  padding ? <th className={styles.cell}><div style={{width: padding}} /></th> : null;

const BodyCell: React.FC<VirtualPaddingProps> = ({ padding }) =>
  padding ? <td style={{ display: 'flex', width: padding }} /> : null;

const Row: React.FC<VirtualPaddingProps> = ({ padding }) =>
  padding ? (
    <tr>
      <td style={{ height: padding }} />
    </tr>
  ) : null;

export const VirtualPadding = {
  HeaderCell,
  BodyCell,
  Row
};
