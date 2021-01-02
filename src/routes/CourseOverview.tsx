import { Empty, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Button from '../components/button';
import { CourseHeader } from '../components/course/CourseHeader';
import { CourseList } from '../components/course/CourseList';
import { ApiContext } from '../context/ApiContext';
import { UserContext } from '../context/UserContext';
import { ParsedCourseOverview, Tag } from '../types/Course';
import { parseCourse } from '../utils/CourseUtil';
import classes from './CourseOverview.module.scss';

export const CourseOverview: React.FC = () => {
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useContext(ApiContext);
  const userContext = useContext(UserContext);

  const loadCourses = () => {
    setLoading(true);

    apiContext
      .getCourses()
      .then((apiCourses) => {
        setCourses(apiCourses.map(parseCourse));
        return apiContext.getCourseTags();
      })
      .then((apiTags) => {
        setTags(apiTags);
      })
      .catch((err) => {
        console.error(err);
        message.error('Kurse konnten nicht geladen werden.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCourses();
  }, [userContext.user.type]);

  const renderCourseLists = () => {
    if (tags.length === 0) {
      return (
        <div className={classes.loadingContainer}>
          <Empty description="Es wurden keine Kurse gefunden." />
          <Button
            backgroundColor="#f4486d"
            color="#ffffff"
            className={classes.button}
            onClick={loadCourses}
          >
            Erneut versuchen
          </Button>
        </div>
      );
    }

    return tags.map((t) => (
      <CourseList
        tag={t}
        courses={courses.filter((c) => c.tags.map((t) => t.id).includes(t.id))}
      />
    ));
  };

  return (
    <>
      <CourseHeader
        courses={courses}
        onChange={(filteredCourses) => {
          console.log(filteredCourses);
        }}
      />
      {loading ? (
        <div className={classes.loadingContainer}>
          <ClipLoader size={100} color="#f4486d" loading />
          <p>Kurse werden geladen</p>
        </div>
      ) : (
        renderCourseLists()
      )}
    </>
  );
};
