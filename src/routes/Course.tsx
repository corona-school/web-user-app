import React, { useContext, useState, useEffect } from 'react';
import Context from '../context';

import classes from './Course.module.scss';
import { CourseOverview } from '../types';
import { message, Empty } from 'antd';
import { Title } from '../components/Typography';
import CourseCard from '../components/cards/CourseCard';
import Button from '../components/button';
import Icons from '../assets/icons';
import { useHistory } from 'react-router-dom';

const Course = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseOverview[]>([]);
  const apiContext = useContext(Context.Api);
  const userContext = useContext(Context.User);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    apiContext
      .getCourses()
      .then((c) => {
        setLoading(false);
        setCourses(c);
      })
      .catch((e) => {
        setLoading(false);
        message.error('Kurse konnten nicht geladen werden.');
      });
  }, [apiContext]);

  if (loading) {
    return <div>Kurse werden geladen...</div>;
  }

  const myCourses = courses.filter(
    (c) =>
      c.instructor ===
      `${userContext.user.firstname} ${userContext.user.lastname}`
  );

  return (
    <div className={classes.container}>
      <div className={classes.containerRequests}>
        <div className={classes.header}>
          <Title size="h1">Deine Kurse</Title>
          <Button
            onClick={() => {
              history.push('/courses/create');
            }}
            backgroundColor="#4E6AE6"
            color="white"
            className={classes.courseButton}
          >
            <Icons.Add height="16px" />
            Erstelle einen Kurs
          </Button>
        </div>
        <div className={classes.myCoursesContainer}>
          {myCourses.length === 0 ? (
            <Empty description="Du hast im moment keine Kurse"></Empty>
          ) : (
            myCourses.map((c) => {
              return <div>{c.name}</div>;
            })
          )}
        </div>
      </div>
      <Title size="h2">Alle Kurse</Title>
      {courses.map((c) => {
        return <CourseCard course={c} />;
      })}
    </div>
  );
};

export default Course;
