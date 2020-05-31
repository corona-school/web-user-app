import React, { useContext } from 'react';
import styled from 'styled-components';

import Button from '../button';
import Icons from '../../assets/icons';
import theme from '../../theme';
import Context from '../../context';
import { putUser } from '../../api/api';
import CardBase from '../base/CardBase';

import classes from './OpenRequestCard.module.scss';
import { Text, Title } from '../Typography';
import CardNewBase from '../base/CardNewBase';

const CardTitle = styled.h3`
  color: #333333;
  display: inline-block;
  line-height: 27px;
  font-weight: normal;
  font-size: 18px;
  margin: 5px 0;
`;

interface Props {
  type: 'pending' | 'new';
}

const OpenRequestCard: React.FC<Props> = ({ type }) => {
  const { credentials } = useContext(Context.Auth);
  const { user, fetchUserData } = useContext(Context.User);

  const modifyMatchesRequested = (f: (value: number) => number): void => {
    if (typeof user.matchesRequested !== 'number') return;
    putUser(credentials, {
      firstname: user.firstname,
      lastname: user.lastname,
      matchesRequested: f(user.matchesRequested),
      grade: user.grade,
    }).then(fetchUserData);
  };

  if (type === 'pending')
    return (
      <CardBase highlightColor={'#FCD95C'} className={classes.pendingContainer}>
        <Title size="h4">Offene Anfrage</Title>
        <Text>
          Wir sind auf der Suche nach einem bzw. einer Lernpartner*in für dich
          und werden uns schnellstmöglich bei dir melden.
        </Text>
        <div className={classes.buttonContainer}>
          <Button onClick={() => modifyMatchesRequested((x) => x - 1)}>
            <Icons.Undo /> Zurücknehmen
          </Button>
        </div>
      </CardBase>
    );
  else
    return (
      <div onClick={() => modifyMatchesRequested((x) => x + 1)}>
        <CardNewBase
          highlightColor={theme.color.cardHighlightBlue}
          className={classes.pendingContainer}
        >
          <div className={classes.titleContainer}>
            <Icons.Add height="20px" />
            <Title size="h4">Neue Anfrage</Title>
          </div>
          <Text>
            Wir würden uns sehr darüber freuen, wenn du im Rahmen deiner
            zeitlichen Möglichkeiten eine*n weitere*n Schüler*in unterstützen
            möchtest.
          </Text>
        </CardNewBase>
      </div>
    );
};

export default OpenRequestCard;
