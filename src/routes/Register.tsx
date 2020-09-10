import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SignupContainer from '../components/container/SignupContainer';
import { Title, Text } from '../components/Typography';
import Icons from '../assets/icons';

import classes from './Register.module.scss';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Register = () => {
  const params = useQuery();
  const redirectTo = params.get('redirectTo');

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
        <Link
          to={`/register/tutee?redirectTo=${redirectTo ?? ''}`}
          className={classes.userType}
        >
          <Icons.SignupSchoolBag />
          <Title size="h2" className={classes.userTitle}>
            Schüler*in
          </Title>
        </Link>
        <Link
          to={`/register/tutor?redirectTo=${redirectTo ?? ''}`}
          className={classes.userType}
        >
          <Icons.SignupTutor width="100%" height="100px" />
          <Title size="h2" className={classes.userTitle}>
            Tutor*in
          </Title>
        </Link>
      </div>

      <Text className={classes.helpText}>
        Du hast schon ein Account? Hier <Link to="/login">anmelden</Link>.
      </Text>
    </SignupContainer>
  );
};

export default Register;
