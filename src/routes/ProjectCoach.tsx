import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { WorkInProgress } from '../assets/animations/work-in-progress/WorkInProgress';
import Button from '../components/button';
import { Text, Title } from '../components/Typography';
import context from '../context';
import classes from './ProjectCoach.module.scss';

const ProjectCoach: React.FC = () => {
  const { user } = useContext(context.User);
  const history = useHistory();

  if (!user.isProjectCoach && !user.isProjectCoachee) {
    return null;
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
