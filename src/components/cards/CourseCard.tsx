import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import { CourseOverview } from '../../types/Course';

import classes from './CourseCard.module.scss';

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 15px 5px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

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
