import React from 'react';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import { CourseOverview } from '../../types/Course';

import classes from './CourseCard.module.scss';

interface Props {
  course: CourseOverview;
}

const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <CardBase highlightColor="#79CFCD" className={classes.baseContainer}>
      <Title size="h4">{course.name}</Title>
      <Text large>{course.outline}</Text>
      <Text large>{course.description}</Text>
    </CardBase>
  );
};

export default CourseCard;
