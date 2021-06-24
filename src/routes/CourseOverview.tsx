import { Empty, message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { useHistory } from 'react-router-dom';
import Images from '../assets/images';
import Button from '../components/button';
import { CourseHeader } from '../components/course/CourseHeader';
import { CourseList } from '../components/course/CourseList';
import { ApiContext } from '../context/ApiContext';
import { UserContext } from '../context/UserContext';
import { ParsedCourseOverview, Tag, TagAndCategory } from '../types/Course';
import {
  defaultPublicCourseSort,
  parseCourse,
  scrollToTargetAdjustedRight,
  scrollToTargetAdjustedTop,
} from '../utils/CourseUtil';
import classes from './CourseOverview.module.scss';
import { Text } from '../components/Typography';
import { env } from '../api/config';
import { NoCourses } from '../components/NoService';
import CourseCard from '../components/cards/CourseCard';
import { Spinner } from '../components/loading/Spinner';

interface Props {
  customCourseLink?: (course: ParsedCourseOverview) => string;
  backButtonRoute?: string;
}

export const CourseOverview: React.FC<Props> = ({
  customCourseLink,
  backButtonRoute,
}) => {
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<
    ParsedCourseOverview[] | null
  >(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useContext(ApiContext);
  const userContext = useContext(UserContext);

  const history = useHistory();
  const itemsRef = useRef([]);

  const courseOverviewDisabled = env.REACT_APP_COURSE_OVERVIEW === 'disabled';

  const scrollToItemInSection = (hash, courseList, container) => {
    const courseId = Number(decodeURIComponent(hash.slice(1).split(':')[1]));
    if (courseId != null) {
      setTimeout(() => {
        console.log(courseId, courseList);
        const course = courseList.find((c) => c.id === courseId);
        if (course != null) {
          if (course.el != null) {
            // eslint-disable-next-line no-param-reassign
            container.scrollLeft = course.el.getBoundingClientRect().x;
            scrollToTargetAdjustedRight(
              course.el.parentElement.parentElement,
              course.el,
              50
            );
            course.el.style.transition = '0.1s outline ease-in-out';
            course.el.style.outline = '0px solid #4E6AE6';
            setTimeout(() => {
              course.el.style.outline = '3px solid #4E6AE6';
            }, 150);
            setTimeout(() => {
              course.el.style.outline = '0px solid #4E6AE6';
            }, 750);
          }
        }
      }, 1000);
    }
  };

  const scrollToPreviousSection = (hash) => {
    if (hash.length > 1) {
      const sectionTitle = decodeURIComponent(hash.slice(1).split(':')[0]);
      setTimeout(() => {
        const index = itemsRef.current
          .filter((el) => el != null)
          .find((i) => {
            if (i != null) {
              return i.name === sectionTitle;
            }
            return false;
          });
        scrollToTargetAdjustedTop(index.el, 80);
        scrollToItemInSection(hash, index.courseItemRefs, index.el);
      }, 500);
    }
  };

  const loadCourses = () => {
    if (courseOverviewDisabled) return;

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
        scrollToPreviousSection(history.location.hash);
      });
  };

  useEffect(() => {
    loadCourses();
  }, [userContext.user.type]);

  const coachingTag = tags
    .filter((t) => t.category === 'coaching')
    .reduce<TagAndCategory>(
      (acc, t) => {
        acc.ids.push(t.id);
        return acc;
      },
      { ids: [], name: 'Lerncoaching' }
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

  const invisibleClubTagIds = [
    'material-no',
    'material-required',
    'priorknowledge-no',
    'priorknowledge-required',
  ];

  const priorityClubTagIDs = ['environment', 'mint']; // descending
  const clubTags = [
    ...tags
      .filter((t) => priorityClubTagIDs.includes(t.id))
      .sort(
        (t1, t2) =>
          priorityClubTagIDs.indexOf(t1.id) - priorityClubTagIDs.indexOf(t2.id)
      ),
    ...tags.filter((t) => !priorityClubTagIDs.includes(t.id)),
  ]
    .filter((t) => t.category === 'club' && !invisibleClubTagIds.includes(t.id))
    .map<TagAndCategory>((t) => ({ ids: [t.id], name: t.name }));

  const noTags = { ids: [], name: 'Sonstiges' };

  const sortedTags = [...clubTags, revisionTag, coachingTag, noTags].map(
    (item) => {
      const isFiltering = filteredCourses !== null;
      const list = isFiltering ? filteredCourses : courses;
      const courseList = list.filter(
        (c) =>
          c.tags.filter((courseTag) => item.ids.includes(courseTag.id))
            .length !== 0 ||
          (c.tags.length === 0 && item.ids.length === 0)
      );
      if (courseList.length === 0 && isFiltering) {
        return null;
      }

      return {
        tag: item,
        courseList: courseList.sort(defaultPublicCourseSort),
      };
    }
  );

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, sortedTags.length);
  }, [sortedTags]);

  if (courseOverviewDisabled) {
    return <NoCourses />;
  }
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

    const courseLists = sortedTags
      .map((t, i) => {
        const isFiltering = filteredCourses !== null;
        if (t == null || (t.courseList.length === 0 && isFiltering)) {
          return null;
        }

        const courseItemRefs = [].slice(0, t.courseList.length);

        const courseItems = t.courseList.map((course, index) => (
          <CourseCard
            course={course}
            key={course.id}
            customCourseLink={customCourseLink?.(course)}
            currentAnchor={`${t.tag.name}:${course.id}`}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            ref={(el) => {
              courseItemRefs[index] = { id: course.id, el };
            }}
          />
        ));

        return (
          <CourseList
            name={t.tag.name}
            // eslint-disable-next-line react/no-array-index-key
            key={`${t.tag.name}-${i}`}
            courses={t.courseList}
            customCourseLink={customCourseLink}
            richLink
            elements={courseItems}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            ref={(el) => {
              itemsRef.current[i] = {
                name: t.tag.name,
                courseItems,
                courseItemRefs,
                el,
              };
            }}
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
        backButtonRoute={backButtonRoute}
      />
      {loading && (
        <Spinner message="Kursübersicht wird geladen..." color="#f4486d" />
      )}
      {!loading && renderCourseLists()}
    </>
  );
};
