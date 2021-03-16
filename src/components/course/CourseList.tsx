import React, { useRef } from 'react';
import useSmoothScroll from 'react-smooth-scroll-hook';
import Icons from '../../assets/icons';
import { ParsedCourseOverview } from '../../types/Course';
import CourseCard from '../cards/CourseCard';
import { Title } from '../Typography';
import classes from './CourseList.module.scss';

interface Props {
  name: string;
  courses: ParsedCourseOverview[];
  customCourseLink?: (course: ParsedCourseOverview) => string;
}

export const CourseList: React.FC<Props> = (props) => {
  const courseContainer = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll({
    ref: courseContainer,
    speed: 24,
    direction: 'x',
  });

  if (props.courses.length <= 0) {
    return null;
  }

  return (
    <div className={classes.listContainer}>
      <div className={classes.headerContainer}>
        <div className={classes.titleWrapper}>
          <Title size="h3">{props.name}</Title>
        </div>
        <div className={classes.scrollControls}>
          <button
            className={classes.chevronButton}
            onClick={() => scrollTo(-(360 + 16 + 6))}
          >
            <Icons.ChevronLeft />
          </button>
          <button
            className={classes.chevronButton}
            onClick={() => scrollTo(360 + 16 + 6)}
          >
            <Icons.ChevronRight />
          </button>
        </div>
      </div>
      <div className={classes.courseContainer} ref={courseContainer}>
        {props.courses.map((course, index) => (
          <CourseCard
            course={course}
            key={course.id}
            customCourseLink={props.customCourseLink?.(course)}
            currentAnchor={`${props.name}:${index}`}
          />
        ))}
      </div>
    </div>
  );
};
