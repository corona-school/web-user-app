import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Text, Title } from '../Typography';
import { LinkButton } from '../button';

import classes from './FacebookCard.module.scss';
import { LeftHighlightCard } from './FlexibleHighlightCard';
import {
  facebookCardText,
  facebookLink,
} from '../../assets/mentoringPageAssets';

const FacebookCard = () => {
  const theme = useContext(ThemeContext);

  return (
    <LeftHighlightCard highlightColor={theme.color.cardHighlightRed}>
      <Title size="h3">Facebook Gruppe</Title>
      <Text>{facebookCardText}</Text>
      <LinkButton
        className={classes.buttonParticipate}
        href={facebookLink}
        target="_blank"
        style={{ margin: '4px' }}
      >
        Teilnehmen
      </LinkButton>
    </LeftHighlightCard>
  );
};

export default FacebookCard;
