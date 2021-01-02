import { message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { CourseHeader } from '../components/course/CourseHeader';
import { CourseList } from '../components/course/CourseList';
import { ApiContext } from '../context/ApiContext';
import { UserContext } from '../context/UserContext';
import { ParsedCourseOverview, Tag } from '../types/Course';
import { parseCourse } from '../utils/CourseUtil';

export const CourseOverview: React.FC = () => {
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useContext(ApiContext);
  const userContext = useContext(UserContext);

  useEffect(() => {
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
  }, [userContext.user.type]);

  return (
    <>
      <CourseHeader
        courses={courses}
        onChange={(filteredCourses) => {
          console.log(filteredCourses);
        }}
      />
      {loading ? (
        <ClipLoader size={100} color="#123abc" loading />
      ) : (
        tags.map((t) => (
          <CourseList
            tag={t}
            courses={courses.filter((c) =>
              c.tags.map((t) => t.id).includes(t.id)
            )}
          />
        ))
      )}
    </>
  );
};
