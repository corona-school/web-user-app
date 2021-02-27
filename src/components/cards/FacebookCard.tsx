import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Text, Title } from '../Typography';

import classes from './FacebookCard.module.scss';
import { LeftHighlightCard } from './FlexibleHighlightCard';
import {
  facebookCardText,
  facebookLink,
} from '../../assets/mentoringPageAssets';
import AccentColorButton from '../button/AccentColorButton';

const FacebookCard = () => {
  const theme = useContext(ThemeContext);

  return (
    <LeftHighlightCard highlightColor={theme.color.cardHighlightRed}>
      <Title size="h3">Facebook-Gruppe</Title>
      <Text>{facebookCardText}</Text>
      <AccentColorButton
        onClick={() => window.open(facebookLink, '_blank')}
        accentColor="#F4486D"
        label="Ansehen"
        className={classes.buttonParticipate}
        small
      />
    </LeftHighlightCard>
  );
};

export default FacebookCard;
