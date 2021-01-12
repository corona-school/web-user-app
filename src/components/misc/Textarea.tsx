import React from 'react';
import styles from './Textbox.module.scss';

export default function Textarea(props) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={styles.label}>
      {props.label}
      <textarea
        className={styles.textarea}
        value={props.value}
        onChange={props.onChange}
      />
    </label>
  );
}
