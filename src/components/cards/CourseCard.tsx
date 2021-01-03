import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Text, Title } from '../Typography';
import { ParsedCourseOverview } from '../../types/Course';

import classes from './CourseCard.module.scss';
import Images from '../../assets/images';

interface Props {
  course: ParsedCourseOverview;
}

const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <Link className={classes.baseContainer} to={`/courses/${course.id}`}>
      <div className={classes.highlight} />
      <div className={classes.coverImageContainer}>
        <img
          className={classes.coverImage}
          src={course.image ?? Images.DrehtuerDefaultCourseCover}
          alt="Cover-Bild des Kurses"
        />
      </div>
      <Title size="h4" bold>
        {course.name}
      </Title>
      <Text large>{course.description}</Text>
      <div className={classes.info}>
        <Text large>
          ab {moment(course.subcourse?.lectures[0].start).format('DD.MM.')}
        </Text>
        <Text large>{course.subcourse?.lectures.length} Termine</Text>
        <Text large>
          {course.subcourse?.minGrade}. - {course.subcourse?.maxGrade}. Klasse
        </Text>
        <Text large>
          {course.subcourse?.participants} / {course.subcourse?.maxParticipants}
        </Text>
      </div>
    </Link>
  );
};

export default CourseCard;
