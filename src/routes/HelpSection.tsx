import React, { useContext } from 'react';
import { Title } from '../components/Typography';
import { UserContext } from '../context/UserContext';
import classes from './HelpSection.module.scss';

export const HelpSection = () => {
  const userContext = useContext(UserContext);

  if (userContext.user.type !== 'student') return <></>;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Title>Hilfestellungen</Title>
      </div>
    </div>
  );
};
