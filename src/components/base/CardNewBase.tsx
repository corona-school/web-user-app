import React from 'react';
import classnames from 'classnames';
import classes from './CardNewBase.module.scss';

interface Props {
  className?: string;
  disabled: boolean;
}

const CardNewBase: React.FC<Props> = ({ className, children, disabled }) => {
  return (
    <div
      className={classnames(
        classes.container,
        className,
        disabled ? classes.disabled : ''
      )}
    >
      <div
        className={classnames(
          classes.cardContent,
          disabled ? classes.disabled : ''
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default CardNewBase;
