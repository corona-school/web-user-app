import React, { useContext } from 'react';

import classes from './Course.module.scss';
import { UserContext } from '../context/UserContext';
import { CourseBanner } from '../components/course/CourseBanner';
import { CoursesPersonalList } from '../components/course/CoursesPersonalList';

const Course = () => {
  const userContext = useContext(UserContext);

  return (
    <div className={classes.container}>
      <CourseBanner
        targetGroup={
          userContext.user.type === 'student' ? 'instructors' : 'participants'
        }
      />
      <CoursesPersonalList />
    </div>
  );
};

export default Course;
