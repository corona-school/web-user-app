import React, { useContext, useState, useEffect } from 'react';
import Context from '../context';
import { Empty } from 'antd';
import { Title } from '../components/Typography';
import Button from '../components/button';
import Icons from '../assets/icons';
import { useHistory } from 'react-router-dom';
import { ParsedCourseOverview } from '../types/Course';
import MyCourseCard from '../components/cards/MyCourseCard';

import classes from './Course.module.scss';
import { parseCourse } from '../utils/CourseUtil';
import { UserContext } from '../context/UserContext';

const Course = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);
  const [myCourses, setMyCourses] = useState<ParsedCourseOverview[]>([]);
  const apiContext = useContext(Context.Api);
  const userContext = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);

    apiContext
      .getCourses()
      .then((c) => {
        setCourses(c.map(parseCourse));
        return apiContext.getMyCourses(userContext.user.type);
      })
      .then((c) => {
        setMyCourses(c.map(parseCourse));
      })
      .catch((e) => {
        // message.error('Kurse konnten nicht geladen werden.');
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
              return <MyCourseCard course={c} />;
            })
          )}
        </div>
      </div>
      <Title size="h2">Alle Kurse</Title>
      {courses.length === 0 ? (
        <Empty
          style={{ marginBottom: '64px' }}
          description="Es gibt im moment keine Kurse"
        ></Empty>
      ) : (
        courses.map((c) => {
          return <MyCourseCard course={c} />;
        })
      )}
    </div>
  );
};

export default Course;
