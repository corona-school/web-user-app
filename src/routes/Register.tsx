import React from 'react';
import SignupContainer from '../components/container/SignupContainer';
import { Title, Text } from '../components/Typography';
import Icons from '../assets/icons';
import { Link } from 'react-router-dom';

import classes from './Register.module.scss';

const Register = () => {
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
        <Title>Ich möchte mich registrieren als...</Title>
      </div>

      <div className={classes.userTypeContainer}>
        <Link to="/register/tutee" className={classes.userType}>
          <Icons.SignupSchoolBag />
          <Title size="h2" className={classes.userTitle}>
            Schüler*in
          </Title>
        </Link>
        <Link to="/register/tutor" className={classes.userType}>
          <Icons.SignupTutor width="100%" height="100px" />
          <Title size="h2" className={classes.userTitle}>
            Tutor*in
          </Title>
        </Link>
      </div>

      <Text className={classes.helpText}>
        Du hast schon ein Account? Hier <Link to="/login">anmelden</Link>
      </Text>
    </SignupContainer>
  );
};

export default Register;
