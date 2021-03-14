import React from 'react';
import styles from './Checkbox.module.scss';

const CheckboxBase: React.FC<{
  text?: string;
  accentColor: string;
  checked: boolean;
  onClick: (e) => void;
}> = ({ text, accentColor, checked, onClick, children }) => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={styles.checkboxContainer}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {text}
      <input type="checkbox" checked={checked} onChange={onClick} />
      <span className={styles.checkmark} />
      {children}
    </label>
  );
};
export default CheckboxBase;
