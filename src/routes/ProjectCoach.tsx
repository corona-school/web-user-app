import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import { WorkInProgress } from '../assets/animations/work-in-progress/WorkInProgress';
import Button from '../components/button';
import { Text, Title } from '../components/Typography';
import context from '../context';
import classes from './ProjectCoach.module.scss';
import { LeftHighlightCard } from '../components/cards/FlexibleHighlightCard';
import BecomeProjectCoachModal from '../components/Modals/BecomeProjectCoachModal';
import BecomeProjectCoacheeModal from '../components/Modals/BecomeProjectCoacheeModal';

const ProjectCoach: React.FC = () => {
  const { user } = useContext(context.User);
  const history = useHistory();
  const theme = useContext(ThemeContext);
  const modalContext = useContext(context.Modal);

  if (!user.isProjectCoach && user.isTutor) {
    return (
      <div className={classes.container}>
        <Title size="h1">Projektcoaching</Title>
        <LeftHighlightCard highlightColor={theme.color.cardHighlightYellow}>
          <Title size="h3">Lorem Ipsum</Title>
          <Text>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet.
          </Text>
          <Button
            className={classes.buttonParticipate}
            onClick={() => modalContext.setOpenedModal('becomeProjectCoach')}
          >
            Projektcoach werden
          </Button>
        </LeftHighlightCard>
        <BecomeProjectCoachModal />
      </div>
    );
  }

  if (!user.isProjectCoachee && user.isPupil) {
    return (
      <div className={classes.container}>
        <Title size="h1">Projektcoaching</Title>
        <LeftHighlightCard highlightColor={theme.color.cardHighlightYellow}>
          <Title size="h3">Lorem Ipsum</Title>
          <Text>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet.
          </Text>
          <Button
            className={classes.buttonParticipate}
            onClick={() => modalContext.setOpenedModal('becomeProjectCoachee')}
          >
            Unterstützung anfordern
          </Button>
        </LeftHighlightCard>
        <BecomeProjectCoacheeModal />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Title size="h1">Projektcoaching</Title>
      <div className={classes.wipContainer}>
        <WorkInProgress />
        <Title size="h2" className={classes.title}>
          Bald verfügbar
        </Title>
        {user.type === 'student' ? (
          <Text large className={classes.text}>
            Hier kannst du bald Schüler im 1:1-Projektcoaching unterstützen
          </Text>
        ) : (
          <Text>
            Hier kannst du bald Unterstützung für 1:1-Projektcoaching anfordern
          </Text>
        )}
        <Button
          backgroundColor="#FFF7DB"
          color="#FFCC12"
          onClick={() => {
            history.push('/settings');
          }}
        >
          Zu den Einstellungen
        </Button>
      </div>
    </div>
  );
};

export default ProjectCoach;
