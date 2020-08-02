import React, { useContext } from 'react';
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
import { firstLectureOfSubcourse } from '../../utils/CourseUtil';

import classes from './MyCourseCard.module.scss';
import { AuthContext } from '../../context/AuthContext';

interface Props {
  ownedByMe?: boolean;
  course: ParsedCourseOverview;
  redirect?: string;
}

export const CourseStateToLabel = new Map([
  [CourseState.SUBMITTED, 'Eingereicht'],
  [CourseState.CREATED, 'Erstellt'],
  [CourseState.ALLOWED, 'Erlaubt'],
  [CourseState.DENIED, 'Nicht Erlaubt'],
  [CourseState.CANCELLED, 'Abgesagt'],
]);

export const CategoryToLabel = new Map([
  [CourseCategory.REVISION, 'Repititorium'],
  [CourseCategory.COACHING, 'Lern-Coaching'],
  [CourseCategory.CLUB, 'AGs'],
]);

const MyCourseCard: React.FC<Props> = ({ course, redirect, ownedByMe }) => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const subCourse = course.subcourse;
  const firstLecture = firstLectureOfSubcourse(subCourse);

  const userId = auth.credentials.id;
  const isMyCourse =
    course.instructors.some((i) => i.id === userId) ||
    course.subcourse?.instructors.some((i) => i.id === userId);

  const redirectToDetailPage = () => {
    if (redirect) {
      history.push(redirect);
      return;
    }
    console.log(course.subcourse, isMyCourse, course);
    if (!course.subcourse && (isMyCourse || ownedByMe)) {
      history.push('/courses/edit/' + course.id);
      return;
    }
    history.push('/courses/' + course.id);
  };

  const renderAdditionalDates = () => {
    const title = (
      <div>
        {subCourse?.lectures
          .filter((l) => l !== firstLecture)
          .map((l) => {
            return <div>{moment.unix(l.start).format('DD.MM.YY')}</div>;
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
            {isMyCourse && (
              <div className={classes.metaInfo}>
                <Tag
                  background={
                    course.state === CourseState.CANCELLED
                      ? '#F4486D'
                      : undefined
                  }
                  style={{ margin: 0 }}
                >
                  {CourseStateToLabel.get(course.state)}
                </Tag>
              </div>
            )}

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
                Beginn: {moment.unix(firstLecture.start).format('DD.MM.YY')}{' '}
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
