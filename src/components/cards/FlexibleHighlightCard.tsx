import React from 'react';
import Highlight, { TopHighlight } from '../Highlight';

import classes from './FlexibleHighlightCard.module.scss';

export const FlexibleHighlightCard: React.FC<{
  highlightColor: string;
  children: React.AllHTMLAttributes<HTMLDivElement>;
}> = ({ highlightColor, children }) => {
  return (
    <div className={classes.container}>
      <Highlight color={highlightColor} />
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};

export const TopHighlightCard: React.FC<{
  highlightColor: string;
  children: React.AllHTMLAttributes<HTMLDivElement>;
}> = ({ highlightColor, children }) => {
  return (
    <div className={classes.container} style={{ flexDirection: 'column' }}>
      <TopHighlight color={highlightColor} />
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};
