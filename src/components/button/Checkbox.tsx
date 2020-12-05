import React from 'react';
import styles from './Checkbox.module.scss';

export function Checkbox({ text, accentColor, checked, onClick }) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={styles.checkboxContainer}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {text}
      <input type="checkbox" checked={checked} onChange={onClick} />
      <span className={styles.checkmark} />
    </label>
  );
}
