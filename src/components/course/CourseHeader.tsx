import React, { useEffect, useState } from 'react';
import { Checkbox, Divider, Input, Row, Col, Button } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import classes from './CourseHeader.module.scss';
import { ParsedCourseOverview } from '../../types/Course';
import { Title } from '../Typography';
import Icons from '../../assets/icons';
import { setNonTimeComponentsCopy } from '../../utils/DateUtils';

const { Search } = Input;

interface Props {
  courses: ParsedCourseOverview[];
  onChange: (filteredCourses: ParsedCourseOverview[] | null) => void;
  backButtonRoute?: string;
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

  const history = useHistory();

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
        const schoolTime = moment('13:00am', 'HH:mm'); // ... on the CURRENT day
        if (
          allowedTime.includes('vormittags') &&
          allowedTime.includes('nachmittags')
        ) {
          return true;
        }

        if (allowedTime.includes('vormittags')) {
          return c.subcourse?.lectures.some((l) =>
            setNonTimeComponentsCopy(moment.unix(l.start), schoolTime).isBefore(
              schoolTime
            )
          );
        }

        if (allowedTime.includes('nachmittags')) {
          return c.subcourse?.lectures.some((l) =>
            setNonTimeComponentsCopy(
              moment.unix(l.start),
              schoolTime
            ).isSameOrAfter(schoolTime)
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
    <>
      {props.backButtonRoute && (
        <Row>
          <Col>
            <div className={classes.backButtonContainer}>
              <button
                className={classes.backButton}
                onClick={() => {
                  history.push(props.backButtonRoute);
                }}
              >
                <Icons.ChevronLeft />
                Zurück
              </button>
            </div>
          </Col>
        </Row>
      )}

      <Row justify="space-around" align="middle">
        <Col md={18}>
          <div className={classes.filterContainerWrapper}>
            <Row justify="space-between">
              <Col>
                <Title size="h2" bold className={classes.title}>
                  Kurse filtern
                </Title>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    setAllowedGrades(grades);
                    setSearch('');
                    setAllowedTime(['vormittags', 'nachmittags']);
                  }}
                  className={classNames(classes.resetButton, {
                    [classes.hideResetButton]: isReset(),
                  })}
                >
                  Filter zurücksetzen
                </Button>
              </Col>
            </Row>
            <div className={classes.filterContainer}>
              <div className={classes.divider}>
                <span>Uhrzeit</span>
              </div>
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
            <div className={classes.filterContainer}>
              <div className={classes.divider}>
                <span>Jahrgangsstufe</span>
              </div>
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
            </div>
            <div className={classes.filterContainer}>
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
              <div className={classes.advancedFilterContainer} />
              <div className={classes.searchContainer}>
                <Search
                  size="large"
                  placeholder="Suche nach einem Kurs..."
                  allowClear
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div className={classes.headerContainer} />
    </>
  );
};
