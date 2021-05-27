import React, { CSSProperties } from 'react';
import styles from './Select.module.scss';

const Select: React.FC<{
  onChange: (e) => void;
  value: string | number;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  style?: CSSProperties;
}> = (props) => {
  return (
    <select
      className={styles.select + (props.className ? ` ${props.className}` : '')}
      onChange={props.onChange}
      value={props.value}
      disabled={props.disabled}
      placeholder={props.placeholder}
      style={props.style ?? {}}
    >
      {props.children}
    </select>
  );
};

export default Select;
