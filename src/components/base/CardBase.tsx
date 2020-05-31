import React from 'react';
import Highlight from '../Highlight';
import classes from './CardBase.module.scss';

interface Props {
  highlightColor: string;
}

const CardBase: React.FC<Props> = ({ highlightColor, children }) => {
  return (
    <div className={classes.container}>
      <Highlight color={highlightColor} />
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};

export default CardBase;
