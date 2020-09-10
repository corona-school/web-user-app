import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import Highlight from '../Highlight';

import classes from './SupportCard.module.scss';

const SupportCard: React.FC<React.AllHTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  const theme = useContext(ThemeContext);

  return (
    <div className={classes.container}>
      <Highlight color={theme.color.cardHighlightRed} />
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};

export default SupportCard;
