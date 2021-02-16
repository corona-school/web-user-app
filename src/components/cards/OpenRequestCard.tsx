import React, { useContext, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { message } from 'antd';

import Icons from '../../assets/icons';
import theme from '../../theme';
import Context from '../../context';
import { putUser } from '../../api/api';
import CardBase from '../base/CardBase';

import classes from './OpenRequestCard.module.scss';
import { Text, Title } from '../Typography';
import CardNewBase from '../base/CardNewBase';
import AccentColorButton from '../button/AccentColorButton';
import { ReactComponent as Trashcan } from '../../assets/icons/trashcan.svg';

interface Props {
  type: 'pending' | 'new';
  userType: 'student' | 'pupil';
  projectCoaching: boolean;
}

const OpenRequestCard: React.FC<Props> = ({
  type,
  userType,
  projectCoaching,
}) => {
  const [loading, setLoading] = useState(false);
  const { credentials } = useContext(Context.Auth);
  const { user, fetchUserData } = useContext(Context.User);

  const modifyMatchesRequested = (f: (value: number) => number): void => {
    if (typeof user.matchesRequested !== 'number') return;
    setLoading(true);
    putUser(credentials, {
      firstname: user.firstname,
      lastname: user.lastname,
      matchesRequested: projectCoaching
        ? user.matchesRequested
        : f(user.matchesRequested),
      projectMatchesRequested: projectCoaching
        ? f(user.projectMatchesRequested)
        : user.projectMatchesRequested,
      grade: user.grade,
      lastUpdatedSettingsViaBlocker: user.lastUpdatedSettingsViaBlocker,
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
      <CardBase highlightColor="#e78b00" className={classes.pendingContainer}>
        <Title size="h4">Offene Anfrage</Title>
        <Text>
          {projectCoaching &&
            `Wir sind auf der Suche nach einem ${
              user.type === 'student' ? 'Coachingpartner' : 'Coach'
            } für dich
            und werden uns schnellstmöglich bei dir melden.`}
          {!projectCoaching &&
            'Wir sind auf der Suche nach einem bzw. einer Lernpartner*in für dich und werden uns schnellstmöglich bei dir melden.'}
        </Text>
        <div className={classes.buttonContainer}>
          <AccentColorButton
            accentColor="#e78b00"
            onClick={() => modifyMatchesRequested((x) => x - 1)}
            Icon={Trashcan}
            label="Zurücknehmen"
            small
          />
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
              : `Hier kannst du ${
                  projectCoaching
                    ? 'einen neuen Coach anfordern, der'
                    : 'eine*n neue*n Student*in anfordern, die'
                }  dich beim Lernen unterstützt.`}
          </Text>
        )}
      </CardNewBase>
    </button>
  );
};

export default OpenRequestCard;
