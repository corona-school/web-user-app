import React from 'react';
import classnames from 'classnames';
import classes from './CardNewBase.module.scss';

interface Props {
  highlightColor: string;
  className?: string;
}

const CardNewBase: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={classnames(classes.container, className)}>
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};

export default CardNewBase;
