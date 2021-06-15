import React from 'react';
import styles from './Tooltip.module.scss';

export default function Tooltip(props) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <span className={styles.tooltip} data-tooltip={props.label}>
      {props.children}
    </span>
  );
}
