import React, { useContext, useState, useEffect } from 'react';
import Context from '../context';

import classes from './Course.module.scss';
import { message, Empty } from 'antd';
import { Title } from '../components/Typography';
import CourseCard from '../components/cards/CourseCard';
import Button from '../components/button';
import Icons from '../assets/icons';
import { useHistory } from 'react-router-dom';
import { CourseOverview } from '../types/Course';

const Course = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseOverview[]>([]);
  const [myCourses, setMyCourses] = useState<CourseOverview[]>([]);
  const apiContext = useContext(Context.Api);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    apiContext
      .getMyCourses()
      .then((c) => {
        setMyCourses(c);
        return apiContext.getCourses();
      })
      .then((c) => {
        setCourses(c);
      })
      .catch((e) => {
        message.error('Kurse konnten nicht geladen werden.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiContext]);

  if (loading) {
    return <div>Kurse werden geladen...</div>;
  }

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
              return <CourseCard course={c} />;
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
