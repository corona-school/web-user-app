import React from 'react';
import styles from './AccentColorButton.module.scss';
import { hexToRGB } from '../../utils/DashboardUtils';

const AccentColorButton: React.FC<{
  label: string;
  onClick: (e?) => void;
  accentColor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon?: any;
}> = ({ label, onClick, accentColor, Icon }) => {
  return (
    <button
      onClick={onClick}
      className={styles.button}
      style={{
        backgroundColor: hexToRGB(accentColor, 0.18),
        color: accentColor,
      }}
    >
      {Icon != null && (
        <Icon className={styles.icon} style={{ fill: accentColor }} />
      )}
      {label}
    </button>
  );
};

export default AccentColorButton;
