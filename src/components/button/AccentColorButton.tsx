import React from 'react';
import styles from './AccentColorButton.module.scss';
import { hexToRGB } from '../../utils/DashboardUtils';

export default function AccentColorButton({ label, onClick, accentColor }) {
  return (
    <button
      onClick={onClick}
      className={styles.button}
      style={{
        backgroundColor: hexToRGB(accentColor, 0.18),
        color: accentColor,
      }}
    >
      {label}
    </button>
  );
}
