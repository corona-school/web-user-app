import React, { useContext, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { message } from 'antd';

import Button from '../button';
import Icons from '../../assets/icons';
import theme from '../../theme';
import Context from '../../context';
import { putUser } from '../../api/api';
import CardBase from '../base/CardBase';

import classes from './OpenRequestCard.module.scss';
import { Text, Title } from '../Typography';
import CardNewBase from '../base/CardNewBase';

interface Props {
  type: 'pending' | 'new';
  userType: 'student' | 'pupil';
}

const OpenRequestCard: React.FC<Props> = ({ type, userType }) => {
  const [loading, setLoading] = useState(false);
  const { credentials } = useContext(Context.Auth);
  const { user, fetchUserData } = useContext(Context.User);

  const modifyMatchesRequested = (f: (value: number) => number): void => {
    if (typeof user.matchesRequested !== 'number') return;
    setLoading(true);
    putUser(credentials, {
      firstname: user.firstname,
      lastname: user.lastname,
      matchesRequested: f(user.matchesRequested),
      grade: user.grade,
    })
      .then(() => {
        setLoading(false);
        fetchUserData();
      })
      .catch(() => {
        setLoading(false);
        message.error(
          'Es ist etwas schief gegangen. Versuche es später erneut.'
        );
      });
  };

  if (type === 'pending') {
    return (
      <CardBase highlightColor="#FCD95C" className={classes.pendingContainer}>
        <Title size="h4">Offene Anfrage</Title>
        <Text>
          Wir sind auf der Suche nach einem bzw. einer Lernpartner*in für dich
          und werden uns schnellstmöglich bei dir melden.
        </Text>
        <div className={classes.buttonContainer}>
          <Button
            color="#F0CE52"
            backgroundColor="#FFF7DB"
            onClick={() => modifyMatchesRequested((x) => x - 1)}
          >
            <Icons.Delete /> Zurücknehmen
          </Button>
        </div>
      </CardBase>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (!loading) {
          modifyMatchesRequested((x) => x + 1);
        }
      }}
    >
      <CardNewBase
        highlightColor={theme.color.cardHighlightBlue}
        className={classes.pendingContainer}
      >
        <div className={classes.titleContainer}>
          <Icons.Add height="20px" />
          <Title size="h4">Neue Anfrage</Title>
        </div>
        {loading ? (
          <ClipLoader size={100} color="#123abc" loading />
        ) : (
          <Text className={classes.newTextContainer}>
            {userType === 'student'
              ? 'Wir würden uns sehr darüber freuen, wenn du im Rahmen deiner zeitlichen Möglichkeiten eine*n weitere*n Schüler*in unterstützen möchtest.'
              : 'Hier kannst du eine*n neue*n Student*in anfordern, die dich beim Lernen unterstützt.'}
          </Text>
        )}
      </CardNewBase>
    </button>
  );
};

export default OpenRequestCard;
