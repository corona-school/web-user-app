import React from 'react';
import Icons from '../../assets/icons';
import theme from '../../theme';

import classes from './ExpertRequestCard.module.scss';
import { Text, Title } from '../Typography';
import CardNewBase from '../base/CardNewBase';

interface Props {
  onClick: () => void;
}

export const ExpertRequestCard: React.FC<Props> = (props) => {
  return (
    <button onClick={props.onClick}>
      <CardNewBase
        highlightColor={theme.color.cardHighlightBlue}
        className={classes.pendingContainer}
      >
        <div className={classes.titleContainer}>
          <Icons.Add height="20px" />
          <Title size="h4">Mehr Expert*innen finden</Title>
        </div>

        <Text className={classes.newTextContainer}>
          Hier findest du eine ganze Liste weiterer Expert*innen mit ganz
          verschiedenen Kompetenzen, die dir bei deinen spezifischen Problemen
          helfen könnten.
        </Text>
      </CardNewBase>
    </button>
  );
};
