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
import NewMatchConfirmationModal from '../Modals/NewMatchConfirmationModal';
import { ModalContext } from '../../context/ModalContext';

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
  const modalContext = useContext(ModalContext);

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
      <CardBase highlightColor="#FCD95C" className={classes.pendingContainer}>
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
    <div>
      <button
        type="button"
        onClick={() => {
          if (!loading) {
            if (projectCoaching) {
              modifyMatchesRequested((x) => x + 1);
            } else {
              modalContext.setOpenedModal('newMatchConfirmationModal');
            }
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
      <NewMatchConfirmationModal
        requestNewMatch={() => modifyMatchesRequested((x) => x + 1)}
      />
    </div>
  );
};

export default OpenRequestCard;
