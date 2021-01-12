import React from 'react';
import classes from '../routes/RegisterTutee.module.scss';
import Icons from '../assets/icons';
import { Title } from './Typography';
import { WorkInProgress } from '../assets/animations/work-in-progress/WorkInProgress';
import SignupContainer from './container/SignupContainer';

const NoRegistrationsPage = () => {
  return (
    <SignupContainer>
      <div className={classes.signupContainer}>
        <a
          rel="noopener noreferrer"
          href="https://www.corona-school.de/"
          target="_blank"
        >
          <Icons.Logo className={classes.logo} />
          <Title size="h2" bold>
            Corona School
          </Title>
        </a>
        <Title size="h1" style={{ textAlign: 'center' }}>
          Aktuell können leider keine Registrierungen entgegengenommen werden.
        </Title>
      </div>
      <WorkInProgress />
      <Title size="h4">
        Bitte versuche es zu einem späteren Zeitpunkt nochmal.
      </Title>
    </SignupContainer>
  );
};

export default NoRegistrationsPage;
