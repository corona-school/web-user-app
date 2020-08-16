import React, { useContext, useState, useEffect } from 'react';
import { Empty } from 'antd';
import { useHistory } from 'react-router-dom';
import Context from '../context';
import { Title } from '../components/Typography';
import Button from '../components/button';
import Icons from '../assets/icons';
import { ParsedCourseOverview } from '../types/Course';
import MyCourseCard from '../components/cards/MyCourseCard';

import classes from './Course.module.scss';
import { parseCourse, defaultPublicCourseSort } from '../utils/CourseUtil';
import { UserContext } from '../context/UserContext';
import CourseOverview from "../components/CourseOverview";

const MAX_COURSES = 25;

const canJoinCourse = (grade?: number) => (c: ParsedCourseOverview) => {
  if (!c.subcourse) {
    return false;
  }

  if (c.subcourse.participants >= c.subcourse.maxParticipants) {
    return false;
  }

  if (!grade) {
    return true;
  }

  return c.subcourse.minGrade <= grade && grade <= c.subcourse.maxGrade;
};

const Course = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);
  const [myCourses, setMyCourses] = useState<ParsedCourseOverview[]>([]);
  const apiContext = useContext(Context.Api);
  const userContext = useContext(UserContext);
  const history = useHistory();

  const filteredCourses = courses.filter(canJoinCourse(userContext.user.grade));

  useEffect(() => {
    setLoading(true);

    apiContext
      .getCourses()
      .then((c) => {
        setCourses(c.map(parseCourse).sort(defaultPublicCourseSort));
        return apiContext.getMyCourses(userContext.user.type);
      })
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
        <div className={classes.header}>
          <Title size="h1">Deine Kurse</Title>
          {userContext.user.type === 'student' &&
            myCourses.length <= MAX_COURSES && (
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
            )}
        </div>
        <div className={classes.myCoursesContainer}>
          {myCourses.length === 0 ? (
            <Empty description="Du hast im Moment keine Kurse" />
          ) : (
            myCourses.map((c) => {
              return <MyCourseCard course={c} ownedByMe />;
            })
          )}
        </div>
      </div>
      <div className={classes.overviewContainer}>
        <Title size="h2">Alle Kurse</Title>
        <CourseOverview courses={filteredCourses} />
      </div>
    </div>
  );
};

export default Course;
