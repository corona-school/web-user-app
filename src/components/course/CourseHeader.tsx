import React from 'react';
import { Checkbox } from 'antd';
import classes from './CourseHeader.module.scss';
import { ParsedCourseOverview } from '../../types/Course';
import { Title } from '../Typography';

interface Props {
  courses: ParsedCourseOverview[];
  onChange: (filteredCourses: ParsedCourseOverview[]) => void;
}

export const CourseHeader: React.FC<Props> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filterCourses = () => {
    const filteredCourses = props.courses.filter((c) => c.name === 'bla');
    props.onChange(filteredCourses);
  };

  return (
    <div className={classes.headerContainer}>
      <div className={classes.headerCenterContainer}>
        <div className={classes.filterContainer}>
          <Title size="h2" className={classes.title}>
            Jahrgangsstufe
          </Title>
          <Checkbox.Group className={classes.gradeGrid} onChange={() => {}}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
              <Checkbox className={classes.checkbox} value={n.toString()}>
                {n}. Klasse
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
        <div className={classes.filterContainer}>
          <Title size="h2" className={classes.title}>
            Uhrzeit
          </Title>
          <Checkbox.Group className={classes.smallGrid} onChange={() => {}}>
            <Checkbox className={classes.checkbox} value="1">
              Vormittags
            </Checkbox>
            <Checkbox className={classes.checkbox} value="2">
              Nachmittags
            </Checkbox>
          </Checkbox.Group>
        </div>
        <div className={classes.filterContainer}>
          <Title size="h2" className={classes.title}>
            Vorkenntnisse
          </Title>
          <Checkbox.Group className={classes.bigGrid} onChange={() => {}}>
            <Checkbox className={classes.checkbox} value="1">
              Ohne Vorkenntnisse
            </Checkbox>
            <Checkbox className={classes.checkbox} value="2">
              Vorkenntnisse benötigt
            </Checkbox>
          </Checkbox.Group>
        </div>
        <div className={classes.filterContainer}>
          <Title size="h2" className={classes.title}>
            Material
          </Title>
          <Checkbox.Group className={classes.normalGrid} onChange={() => {}}>
            <Checkbox className={classes.checkbox} value="1">
              Ohne Material
            </Checkbox>
            <Checkbox className={classes.checkbox} value="2">
              Material benötigt
            </Checkbox>
          </Checkbox.Group>
        </div>
      </div>
    </div>
  );
};
