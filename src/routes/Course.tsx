import React, { useContext, useState, useEffect } from 'react';
import Context from '../context';
import { LinkButton } from '../components/button';
import Icons from '../assets/icons';
import { ParsedCourseOverview } from '../types/Course';

import classes from './Course.module.scss';
import { parseCourse } from '../utils/CourseUtil';
import { UserContext } from '../context/UserContext';
import { CourseBanner } from '../components/course/CourseBanner';
import { CourseList } from '../components/course/CourseList';

const Course = () => {
  const [loading, setLoading] = useState(false);
  const [myCourses, setMyCourses] = useState<ParsedCourseOverview[]>([]);
  const apiContext = useContext(Context.Api);
  const userContext = useContext(UserContext);

  useEffect(() => {
    setLoading(true);

    apiContext
      .getMyCourses(userContext.user.type)
      .then((c) => {
        setMyCourses(c.map(parseCourse));
      })
      .catch(() => {
        // message.error('Kurse konnten nicht geladen werden.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiContext, userContext.user.type]);

  if (loading) {
    return <div>Kurse werden geladen...</div>;
  }

  return (
    <div className={classes.container}>
      <CourseBanner
        targetGroup={
          userContext.user.type === 'student' ? 'instructors' : 'participants'
        }
      />
      <div className={classes.containerRequests}>
        <div className={classes.header}>
          {userContext.user.type === 'student' && (
            <LinkButton
              href="/courses/create"
              local
              backgroundColor="#F4486D"
              color="white"
              className={classes.courseButton}
            >
              <Icons.Add height="16px" />
              Erstelle einen Kurs
            </LinkButton>
          )}
        </div>
        {myCourses.length > 0 && (
          <CourseList name="Deine aktuellen Kurse" courses={myCourses} />
        )}
      </div>
    </div>
  );
};

export default Course;
