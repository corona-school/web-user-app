import React, { useContext } from 'react';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import context from '../../context';
import classes from './JufoExpertCard.module.scss';
import Button from '../button';

import EditExpertProfileModal from '../Modals/EditExpertProfileModal';
import { ExpertStatus } from '../../types/Expert';

export const JufoExpertCard: React.FC = () => {
  const modalContext = useContext(context.Modal);
  const userContext = useContext(context.User);

  if (!userContext.user.isProjectCoach) {
    return null;
  }

  const renderIntroduction = () => {
    return (
      <Text className={classes.emailText} large>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>
    );
  };
  const renderPending = () => {
    return (
      <Text className={classes.emailText} large>
        Dein Experten-Profil wird noch überprüft... <br />
      </Text>
    );
  };

  const renderExpertData = () => {
    return (
      <Text className={classes.emailText} large>
        Kontakt E-Mail-Adresse: {userContext.user.expertData.contactEmail}{' '}
        <br />
        Beschreibung: {userContext.user.expertData.description} <br />
        Experten-Tags:{' '}
        {userContext.user.expertData.expertiseTags.map((item) => (
          <span key={item}>{item} </span>
        ))}{' '}
        <br />
        Kann vorgeschlagen werden:{' '}
        {userContext.user.expertData.active ? 'Ja' : 'Nein'}
        <br />
      </Text>
    );
  };

  const renderExpertDenied = () => {
    return (
      <Text className={classes.emailText} large>
        Dein Experten-Profil wurde leider abgelehnt. Wende dich bei Fragen bitte
        an unseren Support.
      </Text>
    );
  };

  return (
    <>
      <CardBase highlightColor="#4E6AE6" className={classes.baseContainer}>
        <div className={classes.container}>
          <div className={classes.matchInfoContainer}>
            <Title size="h4" bold>
              Willst du Jufo Experte*in werden?
            </Title>
            {userContext.user.expertData == null && renderIntroduction()}
            {userContext.user.expertData?.allowed === ExpertStatus.PENDING &&
              renderPending()}
            {userContext.user.expertData?.allowed === ExpertStatus.YES &&
              renderExpertData()}
            {userContext.user.expertData?.allowed === ExpertStatus.NO &&
              renderExpertDenied()}
          </div>
          <div className={classes.mainButtonContainer}>
            <Button
              onClick={() => modalContext.setOpenedModal('expertOverviewModal')}
              color="#ffffff"
              backgroundColor="#4E6AE6"
              style={{ margin: '4px' }}
            >
              andere Experten*innen ansehen
            </Button>
            <Button
              onClick={() =>
                modalContext.setOpenedModal('editExpertProfileModal')
              }
              color="#ffffff"
              backgroundColor="#4E6AE6"
              style={{ margin: '4px' }}
            >
              {userContext.user.expertData == null
                ? 'Profil erstellen'
                : 'Profil bearbeiten'}
            </Button>
          </div>
        </div>
      </CardBase>
      <EditExpertProfileModal />
    </>
  );
};
