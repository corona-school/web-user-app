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
          <Title size="h4">Neue Anfrage</Title>
        </div>

        <Text className={classes.newTextContainer}>
          Wir würden uns sehr darüber freuen, wenn du im Rahmen deiner
          zeitlichen Möglichkeiten eine*n weitere*n Jugend-forscht-Teilnehmer*in
          unterstützen möchtest.
        </Text>
      </CardNewBase>
    </button>
  );
};
