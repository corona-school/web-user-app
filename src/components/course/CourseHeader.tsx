import React, { useEffect, useState } from 'react';
import { Checkbox, Divider, Input } from 'antd';
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

const SEARCH_STORE = 'lernfair_course_search';
/* Persist the search configuration so that the user gets a consistent view across pages */
let loadedConfig: {
  allowedGrades: string[];
  allowedTime: string[];
  search: string;
  onlyFree: boolean;
} | null = null;

if (localStorage.getItem(SEARCH_STORE)) {
  try {
    loadedConfig = JSON.parse(localStorage.getItem(SEARCH_STORE));
  } catch (error) {
    console.log('Failed to reload search config', error);
    // Silently fail as persistent search is not a breaking feature
  }
}

export const CourseHeader: React.FC<Props> = (props) => {
  const [allowedGrades, setAllowedGrades] = useState(
    loadedConfig?.allowedGrades ?? grades
  );
  const [allowedTime, setAllowedTime] = useState(
    loadedConfig?.allowedTime ?? ['vormittags', 'nachmittags']
  );
  const [search, setSearch] = useState(loadedConfig?.search ?? '');
  // Only show courses that are free, i.e. those that aren't fully occupied yet.
  const [onlyFree, setOnlyFree] = useState(loadedConfig?.onlyFree ?? false);

  const history = useHistory();

  const isReset = () => {
    return (
      search.length === 0 &&
      allowedGrades.length === grades.length &&
      allowedTime.length === 2 &&
      !onlyFree
    );
  };
  useEffect(() => {
    localStorage.setItem(
      SEARCH_STORE,
      JSON.stringify(
        (loadedConfig = { allowedTime, allowedGrades, search, onlyFree })
      )
    );

    const filteredCourses = props.courses
      .filter((c) => {
        return onlyFree
          ? c.subcourse.participants < c.subcourse.maxParticipants
          : true;
      })
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
    console.log(filteredCourses);
    props.onChange(filteredCourses);
  }, [props.courses, search, allowedGrades, allowedTime, onlyFree]);

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
      {props.backButtonRoute && (
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
      )}
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
            <Divider style={{ margin: '8px 0px' }} />
            <Checkbox
              onChange={(e) => {
                setOnlyFree(e.target.checked);
              }}
              checked={onlyFree}
            >
              Nur freie Kurse
            </Checkbox>
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

          <button
            onClick={() => {
              setAllowedGrades(grades);
              setSearch('');
              setAllowedTime(['vormittags', 'nachmittags']);
              setOnlyFree(false);
            }}
            className={classNames(classes.resetButton, {
              [classes.hideResetButton]: isReset(),
            })}
          >
            Filter zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
};
