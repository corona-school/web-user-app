import React from 'react';
import { Tooltip } from 'antd';
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
  noBg?: boolean;
  disabledHint?: string;
  onMouseEnter?: (e?) => void;
  onMouseLeave?: (e?) => void;
  onFocus?: (e?) => void;
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
  noBg,
  disabledHint,
}) => {
  const getBaseButton = () => {
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
          backgroundColor:
            noBg || false
              ? 'transparent'
              : hexToRGB(disabled || false ? '#000000' : accentColor, 0.18),
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

  if (disabledHint && disabled) {
    return (
      <Tooltip title={disabledHint}>
        <div className={styles.hintWrapper}>{getBaseButton()}</div>
      </Tooltip>
    );
  }

  return getBaseButton();
};

export default AccentColorButton;
