import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Title } from '../components/Typography';
import Icons from '../assets/icons';

import classes from './Register.module.scss';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Register = () => {
  const params = useQuery();
  const redirectTo = params.get('redirectTo');

  return (
    <div>
      <div className={classes.signupContainer}>
        <Title>Registrieren als...</Title>
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
            Helfer*in
          </Title>
        </Link>
      </div>
    </div>
  );
};

export default Register;
