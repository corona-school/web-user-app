import React from 'react';
import styles from './Checkbox.module.scss';

const CheckboxBase: React.FC<{
  text?: string;
  accentColor: string;
  checked: boolean;
  onClick: (e) => void;
  disabled?: boolean;
}> = ({ text, accentColor, checked, onClick, disabled, children }) => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={
        styles.checkboxContainer + (disabled ? ` ${styles.disabled}` : '')
      }
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {text}
      <input
        type="checkbox"
        checked={checked}
        onChange={onClick}
        disabled={disabled}
      />
      <span className={styles.checkmark} />
      {children}
    </label>
  );
};
export default CheckboxBase;
