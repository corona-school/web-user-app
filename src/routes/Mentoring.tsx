import React from 'react';
import classes from './Mentoring.module.scss';
import { Title, Text } from '../components/Typography';
import { mentoringText } from '../assets/mentoringText';

const Mentoring = () => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Title>Mentoring</Title>
        <Text>{mentoringText}</Text>
      </div>
    </div>
  );
};

export default Mentoring;
