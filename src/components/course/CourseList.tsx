import React from 'react';
import { ParsedCourseOverview, Tag } from '../../types/Course';
import Button from '../button';
import { Title } from '../Typography';
import classes from './CourseList.module.scss';

interface Props {
  tag: Tag;
  courses: ParsedCourseOverview[];
}

export const CourseList: React.FC<Props> = (props) => {
  return (
    <div className={classes.listContainer}>
      <div className={classes.headerContainer}>
        <Title size="h3">{props.tag.name}</Title>
        <div className={classes.scrollControls}>
          <Button>leftt</Button>
          <Button>right</Button>
        </div>
      </div>
      <div className={classes.courseContainer}>
        {props.courses.map((course) => (
          <div>{course.name}</div>
        ))}
      </div>
    </div>
  );
};
