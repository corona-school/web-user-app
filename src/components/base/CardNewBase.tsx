import React from 'react';
import classes from './CardNewBase.module.scss';
import classnames from 'classnames';

interface Props {
  highlightColor: string;
  className?: string;
}

const CardNewBase: React.FC<Props> = ({
  highlightColor,
  className,
  children,
}) => {
  return (
    <div className={classnames(classes.container, className)}>
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};

export default CardNewBase;
