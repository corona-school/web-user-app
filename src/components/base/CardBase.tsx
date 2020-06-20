import React from 'react';
import Highlight from '../Highlight';
import classes from './CardBase.module.scss';
import classnames from 'classnames';

interface Props {
  highlightColor: string;
  className?: string;
}

const CardBase: React.FC<Props & React.AllHTMLAttributes<HTMLDivElement>> = ({
  highlightColor,
  className,
  children,
  ...props
}) => {
  return (
    <div {...props} className={classnames(classes.container, className)}>
      <Highlight color={highlightColor} />
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};

export default CardBase;
