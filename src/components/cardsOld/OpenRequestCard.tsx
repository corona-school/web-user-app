import React, { useContext } from 'react';
import styled from 'styled-components';
import CardBase from '../base/CardBase';
import { OldButton } from '../button';
import Icons from '../../assets/icons';
import theme from '../../theme';
import Context from '../../context';
import { putUser } from '../../api/api';

const Card = styled(CardBase)`
  width: 300px;

  > div > p {
    line-height: 21px;
    letter-spacing: -0.333333px;
    color: #4f4f4f;
    margin: 0;
  }

  > div > time {
    line-height: 21px;
    letter-spacing: -0.333333px;
    color: #828282;
    font-style: italic;
    display: inline-block;
    margin-top: 5px;
  }
`;

const CardTitle = styled.h3`
  color: #333333;
  display: inline-block;
  line-height: 27px;
  font-weight: normal;
  font-size: 18px;
  margin: 5px 0;
`;

const CustomButton = styled(OldButton)`
  margin: 15px auto;
`;

const OpenRequestCard: React.FC<{ type: 'pending' | 'new' }> = ({ type }) => {
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
      <Card highlightColor={theme.color.cardHighlightYellow}>
        <CardTitle>Offene Anfrage</CardTitle>
        <p>
          Wir sind auf der Suche nach einem bzw. einer Lernpartner*in für dich
          und werden uns schnellstmöglich bei dir melden.
        </p>
        <CustomButton
          icon={<Icons.Undo />}
          text="Zurücknehmen"
          onClick={() => modifyMatchesRequested((x) => x - 1)}
        />
      </Card>
    );
  else
    return (
      <Card highlightColor={theme.color.cardHighlightBlue}>
        <CardTitle>Neue Anfrage</CardTitle>
        <p>
          Wir würden uns sehr darüber freuen, wenn du im Rahmen deiner
          zeitlichen Möglichkeiten eine*n weitere*n Schüler*in unterstützen
          möchtest.
        </p>
        <CustomButton
          icon={<Icons.Add />}
          text="Anfragen"
          onClick={() => modifyMatchesRequested((x) => x + 1)}
        />
      </Card>
    );
};

export default OpenRequestCard;
