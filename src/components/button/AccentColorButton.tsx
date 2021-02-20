import React from 'react';
import styles from './AccentColorButton.module.scss';
import { hexToRGB } from '../../utils/DashboardUtils';

const AccentColorButton: React.FC<{
  label?: string;
  onClick?: (e?) => void;
  accentColor: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon?: any;
  small?: boolean;
  className?: string;
  title?: string;
}> = ({
  label,
  onClick,
  accentColor,
  Icon,
  disabled,
  children,
  small,
  className,
  title,
}) => {
  return (
    <button
      onClick={onClick}
      className={
        (small || false ? styles.buttonSmall : styles.button) +
        (disabled ? ` ${styles.disabled}` : '') +
        (` ${className}` || '') +
        (label == null ? ` ${styles.onlyIcon}` : '')
      }
      style={{
        backgroundColor: hexToRGB(
          disabled || false ? '#000000' : accentColor,
          0.18
        ),
        color: disabled || false ? '#000000' : accentColor,
      }}
      disabled={disabled || false}
      title={title}
    >
      {children}
      {Icon != null && (
        <Icon className={styles.icon} style={{ fill: accentColor }} />
      )}
      {label}
    </button>
  );
};

export default AccentColorButton;
