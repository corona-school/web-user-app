import React, { useEffect, useState } from 'react';
import { Checkbox, Divider, Input } from 'antd';
import moment from 'moment';
import classes from './CourseHeader.module.scss';
import { ParsedCourseOverview } from '../../types/Course';
import { Title } from '../Typography';

const { Search } = Input;

interface Props {
  courses: ParsedCourseOverview[];
  onChange: (filteredCourses: ParsedCourseOverview[] | null) => void;
}

const grades = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
];

export const CourseHeader: React.FC<Props> = (props) => {
  const [allowedGrades, setAllowedGrades] = useState(grades);
  const [allowedTime, setAllowedTime] = useState(['vormittags', 'nachmittags']);
  const [search, setSearch] = useState('');

  const isReset = () => {
    return (
      search.length === 0 &&
      allowedGrades.length === grades.length &&
      allowedTime.length === 2
    );
  };
  useEffect(() => {
    const filteredCourses = props.courses
      .filter(
        (c) =>
          c.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          c.description
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          c.outline.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          c.state.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )
      .filter((c) =>
        allowedGrades.some((g) => {
          return (
            c.subcourse?.minGrade <= parseInt(g) &&
            c.subcourse?.maxGrade >= parseInt(g)
          );
        })
      )
      .filter((c) => {
        const schoolTime = moment('13:00am', 'HH:mm');

        if (allowedTime.includes('vormittags')) {
          return c.subcourse?.lectures.some((l) =>
            moment.unix(l.start).add(l.duration, 'minutes').isBefore(schoolTime)
          );
        }

        if (allowedTime.includes('nachmittags')) {
          return c.subcourse?.lectures.some((l) =>
            moment.unix(l.start).add(l.duration, 'minutes').isAfter(schoolTime)
          );
        }
        return false;
      });

    if (isReset()) {
      props.onChange(null);
      return;
    }
    props.onChange(filteredCourses);
  }, [search, allowedGrades, allowedTime]);

  const filterGrade = (checkedValue: string[]) => {
    setAllowedGrades(checkedValue);
  };
  const filterTime = (checkedValue: string[]) => {
    setAllowedTime(checkedValue);
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div className={classes.headerContainer}>
      <div className={classes.headerCenterContainer}>
        <div className={classes.advancedFilterContainer}>
          <div className={classes.filterContainer}>
            <Title size="h2" className={classes.title}>
              Jahrgangsstufe
            </Title>
            <Checkbox.Group
              className={classes.gradeGrid}
              onChange={filterGrade}
              value={allowedGrades}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
                <Checkbox
                  className={classes.checkbox}
                  value={n.toString()}
                  key={n}
                >
                  {n}. Klasse
                </Checkbox>
              ))}
            </Checkbox.Group>
            <Divider style={{ margin: '8px 0px' }} />
            <Checkbox
              indeterminate={
                allowedGrades.length !== 0 &&
                allowedGrades.length !== grades.length
              }
              onChange={(e) => {
                if (!e.target.checked) {
                  setAllowedGrades([]);
                  return;
                }

                setAllowedGrades(grades);
              }}
              checked={allowedGrades.length === grades.length}
            >
              Alle Klassen auswählen
            </Checkbox>
          </div>
          <div className={classes.filterContainer}>
            <Title size="h2" className={classes.title}>
              Uhrzeit
            </Title>
            <Checkbox.Group
              className={classes.smallGrid}
              onChange={filterTime}
              value={allowedTime}
            >
              <Checkbox className={classes.checkbox} value="vormittags">
                Vormittags
              </Checkbox>
              <Checkbox className={classes.checkbox} value="nachmittags">
                Nachmittags
              </Checkbox>
            </Checkbox.Group>
          </div>
        </div>
        <div className={classes.searchContainer}>
          <Search
            size="large"
            placeholder="Suche nach einem Kurs..."
            allowClear
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: '100%', margin: '0 10px' }}
          />
          {!isReset() && (
            <button
              onClick={() => {
                setAllowedGrades(grades);
                setSearch('');
                setAllowedTime(['vormittags', 'nachmittags']);
              }}
              className={classes.resetButton}
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
