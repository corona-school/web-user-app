import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import classes from './CoursesPersonalList.module.scss';
import AccentColorLinkButton from '../button/AccentColorLinkButton';
import { ReactComponent as Plus } from '../../assets/icons/plus-solid.svg';
import { CourseList } from './CourseList';
import { ParsedCourseOverview } from '../../types/Course';
import Context from '../../context';
import { UserContext } from '../../context/UserContext';
import { parseCourse } from '../../utils/CourseUtil';
import { Spinner } from '../loading/Spinner';

interface Props {
  revisionsOnly?: boolean;
}

export const CoursesPersonalList: React.FC<Props> = ({
  revisionsOnly = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [myCourses, setMyCourses] = useState<ParsedCourseOverview[]>([]);
  const apiContext = useContext(Context.Api);
  const userContext = useContext(UserContext);

  useEffect(() => {
    setLoading(true);

    apiContext
      .getMyCourses(userContext.user.type)
      .then((c) => {
        setMyCourses(
          c
            .map(parseCourse)
            .filter((e) =>
              revisionsOnly
                ? e.category === 'revision'
                : e.category !== 'revision'
            )
        );
      })
      .catch(() => {
        // message.error('Kurse konnten nicht geladen werden.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiContext, userContext.user.type]);

  if (loading) {
    return <Spinner message="Kurse werden geladen..." />;
  }

  const getPreviousCourses = () => {
    const previousCourses = [];
    myCourses.forEach((course) => {
      const lectures = course.subcourse.lectures.sort(
        (a, b) => a.start - b.start
      );
      const lastLecture = lectures[lectures.length - 1];
      if (lastLecture != null) {
        const lectureEnd = moment
          .unix(lastLecture.start)
          .add(lastLecture.duration, 'minutes');

        if (moment().isAfter(lectureEnd)) {
          previousCourses.push(course);
        }
      }
    });

    return previousCourses;
  };

  return (
    <div className={classes.containerRequests}>
      <div className={classes.header}>
        {userContext.user.type === 'student' && (
          <AccentColorLinkButton
            link="/courses/create"
            local
            accentColor="#F4486D"
            label="
              Erstelle einen Kurs"
            small
            Icon={Plus}
          />
        )}
      </div>
      {myCourses.filter((x) => !getPreviousCourses().some((y) => y === x))
        .length > 0 && (
        <CourseList
          name={`Deine aktuellen ${
            revisionsOnly ? 'Gruppen-Lernunterstützungen' : 'Kurse'
          }`}
          richLink={false}
          courses={myCourses.filter(
            (x) => !getPreviousCourses().some((y) => y === x)
          )}
        />
      )}

      {getPreviousCourses().length > 0 && (
        <CourseList
          richLink={false}
          name={`Deine vergangenen ${
            revisionsOnly ? 'Gruppen-Lernunterstützungen' : 'Kurse'
          }`}
          courses={getPreviousCourses()}
        />
      )}
    </div>
  );
};
