import React, { forwardRef } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Text, Title } from '../Typography';
import { ParsedCourseOverview } from '../../types/Course';

import classes from './CourseCard.module.scss';

import Icons from '../../assets/icons';
import Images from '../../assets/images';

interface Props {
  course: ParsedCourseOverview;
  customCourseLink?: string;
  currentAnchor: string;
}

const CourseCard: React.FC<Props> = forwardRef(
  ({ course, customCourseLink, currentAnchor }, ref) => {
    return (
      <div className={classes.marginContainer}>
        <Link
          className={classes.baseContainer}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={ref}
          to={
            customCourseLink != null
              ? `${customCourseLink}#${currentAnchor ?? ''}`
              : `/courses/${course.id}#${currentAnchor ?? ''}`
          }
        >
          <div className={classes.coverImageContainer}>
            <img
              className={classes.coverImage}
              src={course.image ?? (Images.DefaultCourseCover as string)}
              alt="Cover-Bild des Kurses"
            />
          </div>

          <div className={classes.contentContainer}>
            <div>
              <Title size="h3" bold className={classes.title}>
                {course.name}
              </Title>
              <Text large className={classes.text}>
                {course.outline}
              </Text>
            </div>
            <div>
              <div className={classes.infoContainer}>
                <div className={classes.info}>
                  <Icons.Calendar />
                  <Text large>
                    ab{' '}
                    {moment
                      .unix(course.subcourse?.lectures[0]?.start)
                      .format('DD.MM.')}
                  </Text>
                </div>
                <div className={classes.info}>
                  <Icons.Hashtag />
                  <Text large>{course.subcourse?.lectures.length} Termine</Text>
                </div>
              </div>
              <div className={classes.infoContainer}>
                <div className={classes.info}>
                  <Icons.School />
                  <Text large>
                    {course.subcourse?.minGrade}. - {course.subcourse?.maxGrade}
                    . Klasse
                  </Text>
                </div>
                <div className={classes.info}>
                  <Icons.Team />
                  <Text large>
                    {course.subcourse?.participants} /{' '}
                    {course.subcourse?.maxParticipants}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

export default CourseCard;
