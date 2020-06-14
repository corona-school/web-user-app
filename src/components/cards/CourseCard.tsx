import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import Button from '../button';
import Icons from '../../assets/icons';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import { Tag } from '../Tag';
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

const categories = new Map([
  ['1', 'Spaß'],
  ['2', 'Schulstoff'],
  ['3', 'Abitur'],
]);

const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <CardBase highlightColor="#79CFCD" className={classes.baseContainer}>
      <div className={classes.container}>
        <div className={classes.matchInfoContainer}>
          <Title size="h4" bold>
            {course.name}
          </Title>
          <Text className={classes.outlineText} large>
            {course.outline}
          </Text>
        </div>
        <div className={classes.tagContainer}>
          <Tag background="#4E555C" color="#ffffff">
            {categories.get(course.category) || '-'}
          </Tag>
        </div>
        <div className={classes.subjectContainer}>
          <Text large>
            <b>Beginn</b>
          </Text>
          <Text className={classes.emailText} large>
            {moment().fromNow()}
          </Text>
        </div>
        <ButtonContainer>
          <Button
            color="#79CFCD"
            backgroundColor="#ebfffe"
            style={{ margin: '4px' }}
          >
            <Icons.VideoChat />
            Mitmachen
          </Button>
        </ButtonContainer>
      </div>
    </CardBase>
  );
};

export default CourseCard;
