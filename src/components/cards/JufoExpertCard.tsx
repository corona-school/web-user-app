import React, { useContext } from 'react';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import context from '../../context';
import classes from './JufoExpertCard.module.scss';
import Button from '../button';

import EditExpertProfileModal from '../Modals/EditExpertProfileModal';
import { ExpertStatus } from '../../types/Expert';
import { Tag } from '../Tag';

export const JufoExpertCard: React.FC = () => {
  const modalContext = useContext(context.Modal);
  const userContext = useContext(context.User);

  if (!userContext.user.isProjectCoach) {
    return null;
  }

  const renderExpertListContent = (title: string, text: React.ReactElement) => {
    return (
      <>
        <Title size="h4" bold>
          {title}
        </Title>
        {text}
      </>
    );
  };

  const renderIntroduction = () => {
    return renderExpertListContent(
      'Willst du als Expert*in gelistet werden?',
      <Text className={classes.emailText} large>
        Hier hast du die Möglichkeit, ein Profil für unsere Expert*innenliste zu
        erstellen.
        <br />
        Die Expert*innenliste ist eine Möglichkeit für Teilnehmer*innen des
        Projektcoachings, um Hilfe bei sehr spezifischen/fachlichen Fragen zu
        finden. In deinem Profil beschreibst du, auf welchem spezifischen Gebiet
        du Expert*in bist, sodass die Schüler*innen dich bei fachlichen Fragen
        aus diesem Gebiet kontaktieren können. Dein Profil wird dazu in einer
        für alle registrierten Schüler*innen zugänglichen Liste aufgeführt.
        <br />
        Um Missbrauch vorzubeugen, wird dein Profil vor Veröffentlichung von
        unserem Team überprüft. Du hast außerdem jederzeit die Möglichkeit, dein
        Profil aus der öffentliche Liste zu entfernen.
      </Text>
    );
  };
  const renderPending = () => {
    return renderExpertListContent(
      'Dein Expert*innenprofil wird überprüft...',
      <Text className={classes.emailText} large>
        Vor der Veröffentlichung überprüft unser Team das von dir erstellte
        Expert*innenprofil.
        <br />
        Wenn es ein Problem mit deinem Profil geben sollte, kontaktieren wir
        dich eventuell noch einmal.
        <br />
      </Text>
    );
  };

  const renderExpertData = () => {
    return renderExpertListContent(
      'Dein Expert*innenprofil ist freigeschaltet',
      <div>
        <Text large bold>
          Kontaktadresse
        </Text>
        <Text large>{userContext.user.expertData.contactEmail}</Text>
        <Text large bold>
          Beschreibung
        </Text>
        <Text large>{userContext.user.expertData.description}</Text>
        <Text large bold>
          Expertise-Tags
        </Text>
        <div className={classes.tagContainer}>
          {userContext.user.expertData.expertiseTags.map((item) => (
            <Tag background="#4E555C" color="#ffffff">
              {item}
            </Tag>
          ))}
        </div>
        <Text large bold>
          Sichtbarkeit des Profils
        </Text>
        <Text large>
          {userContext.user.expertData.active
            ? 'sichtbar für alle Schüler*innen'
            : 'ausgeblendet und nur sichtbar für dich'}
        </Text>
      </div>
    );
  };

  const renderExpertDenied = () => {
    return renderExpertListContent(
      'Dein Expert*innenprofil ist blockiert',
      <Text className={classes.emailText} large>
        Wir haben festgestellt, dass dein Expert*innenprofil Mängel aufweist. Es
        ist bis auf Weiteres für die Veröffentlichung gesperrt! Wende dich bei
        Fragen bitte an unseren Support unter{' '}
        <a href="mailto:support@corona-school.de">support@corona-school.de</a>.
        <br />
        Du hast die Möglichkeit, Änderungen an deinem Profil vorzunehmen, um es
        erneut zur Überprüfung einzureichen.
      </Text>
    );
  };

  return (
    <>
      <CardBase highlightColor="#4E6AE6" className={classes.baseContainer}>
        <div className={classes.container}>
          <div className={classes.matchInfoContainer}>
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
              andere Expert*innen ansehen
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
