import { Empty, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Images from '../assets/images';
import Button from '../components/button';
import { CourseHeader } from '../components/course/CourseHeader';
import { CourseList } from '../components/course/CourseList';
import { ApiContext } from '../context/ApiContext';
import { UserContext } from '../context/UserContext';
import { ParsedCourseOverview, Tag, TagAndCategory } from '../types/Course';
import { parseCourse } from '../utils/CourseUtil';
import classes from './CourseOverview.module.scss';
import { Text } from '../components/Typography';

export const CourseOverview: React.FC = () => {
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<
    ParsedCourseOverview[] | null
  >(null);
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
    const coachingTag = tags
      .filter((t) => t.category === 'coaching')
      .reduce<TagAndCategory>(
        (acc, t) => {
          acc.ids.push(t.id);
          return acc;
        },
        { ids: [], name: 'Lernunterstützung' }
      );

    const revisionTag = tags
      .filter((t) => t.category === 'revision')
      .reduce<TagAndCategory>(
        (acc, t) => {
          acc.ids.push(t.id);
          return acc;
        },
        { ids: [], name: 'Repetitorium' }
      );

    const clubTags = tags
      .filter((t) => t.category === 'club')
      .map<TagAndCategory>((t) => ({ ids: [t.id], name: t.name }));

    const courseLists = [...clubTags, revisionTag, coachingTag]
      .map((t, i) => {
        const isFiltering = filteredCourses !== null;
        const list = isFiltering ? filteredCourses : courses;
        const courseList = list.filter(
          (c) =>
            c.tags.filter((courseTag) => t.ids.includes(courseTag.id))
              .length !== 0
        );

        if (courseList.length === 0 && isFiltering) {
          return null;
        }

        return (
          <CourseList
            name={t.name}
            // eslint-disable-next-line react/no-array-index-key
            key={`${t.name}-${i}`}
            courses={courseList}
          />
        );
      })
      .filter((c) => c !== null);

    if (courseLists.length === 0) {
      return (
        <div className={classes.loadingContainer}>
          <Images.Empty className={classes.emptyImage} />
          <Text large>Wir konnten leider keine Kurse finden.</Text>
        </div>
      );
    }

    return courseLists;
  };

  return (
    <>
      <CourseHeader
        courses={courses}
        onChange={(courseList) => {
          setFilteredCourses(courseList);
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
