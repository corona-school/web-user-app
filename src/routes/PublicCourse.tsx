import React from 'react';
import { Title } from '../components/Typography';

import classes from './PublicCourse.module.scss';
import Icons from '../assets/icons';
import { CourseOverview } from './CourseOverview';

interface Props {
  revisions?: boolean;
}

const PublicCourse: React.FC<Props> = ({ revisions = false }) => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.logo}>
          <Icons.Logo />
          <Title style={{ margin: '0px 0px 0px 8px' }} size="h3">
            Lern-Fair
          </Title>
        </div>
      </div>
      <div className={classes.main}>
        <CourseOverview
          customCourseLink={(course) => `/public/courses/${course.id}`}
          revisionOnly={revisions}
        />
      </div>
      <div className={classes.legal}>
        <a href="https://www.lern-fair.de/datenschutz">Datenschutzerklärung</a>
        <a href="https://www.lern-fair.de/impressum">Impressum</a>
      </div>
    </div>
  );
};

export default PublicCourse;
