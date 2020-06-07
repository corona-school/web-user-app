import React from 'react';

import classes from './RegisterTutee.module.scss';
import SignupContainer from '../components/signup/SignupContainer';
import Icons from '../assets/icons';
import { Title } from '../components/Typography';

const RegisterTutee = () => {
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
        <Title>
          Ich möchte mich registrieren als <b>Schüler*in</b>
        </Title>
      </div>
    </SignupContainer>
  );
};

export default RegisterTutee;
