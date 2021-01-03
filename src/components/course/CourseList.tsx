import React, { useRef } from 'react';
import useSmoothScroll from 'react-smooth-scroll-hook';
import Icons from '../../assets/icons';
import { ParsedCourseOverview } from '../../types/Course';
import CourseCard from '../cards/CourseCard';
import { Text, Title } from '../Typography';
import classes from './CourseList.module.scss';

interface Props {
  name: string;
  courses: ParsedCourseOverview[];
}

export const CourseList: React.FC<Props> = (props) => {
  const courseContainer = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll({
    ref: courseContainer,
    speed: 24,
    direction: 'x',
  });

  return (
    <div className={classes.listContainer}>
      <div className={classes.headerContainer}>
        <Title size="h3">{props.name}</Title>
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
        {props.courses.map((course) => (
          <CourseCard course={course} key={course.id} />
        ))}
        {props.courses.length === 0 && (
          <Text large>Leider haben wir keine Kurse für diese Kategorie</Text>
        )}
      </div>
    </div>
  );
};
