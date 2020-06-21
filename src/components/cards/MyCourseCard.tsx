import React from 'react';
import moment from 'moment';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import {
  CourseState,
  CourseCategory,
  ParsedCourseOverview,
} from '../../types/Course';
import { Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import { Tag } from '../Tag';

import classes from './MyCourseCard.module.scss';

interface Props {
  course: ParsedCourseOverview;
  redirect?: string;
}

const CourseStateToLabel = new Map([
  [CourseState.SUBMITTED, 'Eingereicht'],
  [CourseState.CREATED, 'Erstellt'],
  [CourseState.ALLOWED, 'Erlaubt'],
  [CourseState.DENIED, 'Nicht Erlaubt'],
  [CourseState.CANCELLED, 'Abgesagt'],
]);

const CategoryToLabel = new Map([
  [CourseCategory.REVISION, 'Repititorien'],
  [CourseCategory.CLUB, 'AGs'],
]);

const MyCourseCard: React.FC<Props> = ({ course, redirect }) => {
  const history = useHistory();

  const subCourse = course.subcourse;
  const firstLecture = subCourse?.lectures.sort((a, b) => a.start - b.start)[0];

  const redirectToDetailPage = () => {
    if (redirect) {
      history.push(redirect);
      return;
    }
    history.push('courses/' + course.id);
  };

  const renderAdditionalDates = () => {
    const title = (
      <div>
        {subCourse?.lectures
          .filter((l) => l !== firstLecture)
          .map((l) => {
            return <div>{moment(l.start).format('DD.MM.YY')}</div>;
          })}
      </div>
    );

    return (
      <Tooltip title={title} placement="bottomRight">
        <span> (+{subCourse?.lectures.length - 1})</span>
      </Tooltip>
    );
  };

  return (
    <CardBase
      highlightColor={
        course.state === CourseState.CANCELLED ? '#F4486D' : '#79CFCD'
      }
      className={classes.baseContainer}
      onClick={() => redirectToDetailPage()}
    >
      <Title size="h4" className={classes.title}>
        {course.name}{' '}
      </Title>
      <div className={classes.courseBody}>
        <div>
          <Text large className={classes.outline}>
            {course.outline}
          </Text>
          <Text large className={classes.courseDescription}>
            {course.description}
          </Text>
          <div className={classes.metaInfo}>
            {course.tags.map((t) => {
              return <Tag style={{ margin: 4 }}>{t.name}</Tag>;
            })}
          </div>
        </div>
        <div className={classes.metaInfoContainer}>
          <div className={classes.metaInfo1}>
            <div className={classes.metaInfo}>
              {CategoryToLabel.get(course.category)}
            </div>
            <div className={classes.metaInfo}>
              <Tag
                background={
                  course.state === CourseState.CANCELLED ? '#F4486D' : undefined
                }
                style={{ margin: 0 }}
              >
                {CourseStateToLabel.get(course.state)}
              </Tag>
            </div>

            <div className={classes.metaInfo}>
              {subCourse?.participants}/{subCourse?.maxParticipants} Teilnehmer
            </div>
          </div>
          <div className={classes.metaInfo1}>
            <div className={classes.metaInfo}>
              {subCourse?.minGrade}-{subCourse?.maxGrade} Klasse
            </div>
            {firstLecture && (
              <div className={classes.metaInfo}>
                Beginn: {moment(firstLecture.start).format('DD.MM.YY')}{' '}
                {subCourse?.lectures.length > 1 ? renderAdditionalDates() : ''}
              </div>
            )}
            {firstLecture && (
              <div className={classes.metaInfo}>
                Dauer: {firstLecture.duration}min
              </div>
            )}
          </div>
        </div>
      </div>
    </CardBase>
  );
};

export default MyCourseCard;
