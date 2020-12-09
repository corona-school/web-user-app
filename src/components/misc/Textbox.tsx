import React from 'react';
import styles from './Textbox.module.scss';

export default function Textbox(props) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={styles.label}>
      {props.label}
      <input
        type="text"
        className={styles.textbox}
        value={props.value}
        onChange={props.onChange}
      />
    </label>
  );
}
