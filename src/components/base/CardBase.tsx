import React from 'react';
import classnames from 'classnames';
import Highlight from '../Highlight';
import classes from './CardBase.module.scss';

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
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...props} className={classnames(classes.container, className)}>
      <Highlight color={highlightColor} />
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};

export default CardBase;
