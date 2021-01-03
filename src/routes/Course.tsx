import React, { useContext, useState, useEffect } from 'react';
import { Empty } from 'antd';
import Context from '../context';
import { Title } from '../components/Typography';
import { LinkButton } from '../components/button';
import Icons from '../assets/icons';
import { ParsedCourseOverview } from '../types/Course';
import MyCourseCard from '../components/cards/MyCourseCard';

import classes from './Course.module.scss';
import { parseCourse } from '../utils/CourseUtil';
import { UserContext } from '../context/UserContext';
import Images from '../assets/images';

const MAX_COURSES = 25;

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
      <div className={classes.containerRequests}>
        <div className={classes.courseOverviewContainer}>
          <div className={classes.hightightCourse} />
          <div className={classes.couseOverviewContent}>
            <Title size="h1" className={classes.title}>
              Unser neues Kursangebot
            </Title>
            <Images.Graduation className={classes.graduationImage} />
            <LinkButton
              href="/courses/overview"
              local
              backgroundColor="#4E6AE6"
              color="white"
              className={classes.courseButton}
            >
              <Icons.Search height="16px" />
              Kursangebote ansehen
            </LinkButton>
          </div>
        </div>
        <div className={classes.header}>
          <Title size="h1">Deine Kurse</Title>
          {userContext.user.type === 'student' &&
            myCourses.length <= MAX_COURSES && (
              <LinkButton
                href="/courses/create"
                local
                backgroundColor="#4E6AE6"
                color="white"
                className={classes.courseButton}
              >
                <Icons.Add height="16px" />
                Erstelle einen Kurs
              </LinkButton>
            )}
        </div>
        <div className={classes.myCoursesContainer}>
          {myCourses.length === 0 ? (
            <Empty description="Du hast im Moment keine Kurse" />
          ) : (
            myCourses.map((c) => {
              return <MyCourseCard course={c} ownedByMe showCourseState />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;
