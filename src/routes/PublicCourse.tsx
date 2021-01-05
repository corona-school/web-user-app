import React from 'react';
import { Title } from '../components/Typography';

import classes from './PublicCourse.module.scss';
import Icons from '../assets/icons';
import { CourseOverview } from './CourseOverview';

const PublicCourse = () => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.logo}>
          <Icons.Logo />
          <Title style={{ margin: '0px 0px 0px 8px' }} size="h3">
            Corona School
          </Title>
        </div>
      </div>
      <div className={classes.main}>
        <CourseOverview
          customCourseLink={(course) => `/public/courses/${course.id}`}
        />
      </div>
      <div className={classes.legal}>
        <a href="https://www.corona-school.de/datenschutz-2">
          Datenschutzerklärung
        </a>
        <a href="https://www.corona-school.de/impressum">Impressum</a>
      </div>
    </div>
  );
};

export default PublicCourse;
