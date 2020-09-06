import React, { useContext, useState, useEffect } from 'react';
import { Empty, Input, AutoComplete, Checkbox } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import Context from '../context';
import { Title } from '../components/Typography';
import { ParsedCourseOverview, CourseCategory } from '../types/Course';
import MyCourseCard from '../components/cards/MyCourseCard';

import classes from './PublicCourse.module.scss';
import { parseCourse, defaultPublicCourseSort } from '../utils/CourseUtil';
import { Tag } from '../components/Tag';
import { tags } from '../components/forms/CreateCourse';
import Icons from '../assets/icons';

const categoryToLabel = new Map([
  [CourseCategory.CLUB, 'AGs'],
  [CourseCategory.REVISION, 'Repetitorium'],
  [CourseCategory.COACHING, 'Coaching'],
]);

const PublicCourse = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);

  const [filterOpen, setFilterOpen] = useState(false);

  const default1 = tags.get('club').map((t) => t.name);
  const [checkedList1, setCheckedList1] = useState(default1);
  const [indeterminate1, setIndeterminate1] = useState(false);
  const [checkAll1, setCheckAll1] = useState(true);

  const default2 = tags.get('revision').map((t) => t.name);
  const [checkedList2, setCheckedList2] = useState(default2);
  const [indeterminate2, setIndeterminate2] = useState(false);
  const [checkAll2, setCheckAll2] = useState(true);

  const default3 = tags.get('coaching').map((t) => t.name);
  const [checkedList3, setCheckedList3] = useState(default3);
  const [indeterminate3, setIndeterminate3] = useState(false);
  const [checkAll3, setCheckAll3] = useState(true);

  // no tags
  const [checkAll4, setCheckAll4] = useState(true);

  const apiContext = useContext(Context.Api);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const [options, setOptions] = useState<SelectProps<object>['options']>([]);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);

    apiContext
      .getCourses()
      .then((c) => {
        setCourses(c.map(parseCourse).sort(defaultPublicCourseSort));
      })
      .catch(() => {
        // message.error('Kurse konnten nicht geladen werden.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiContext]);

  if (loading) {
    return <div>Kurse werden geladen...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className={classes.container}>
        <Empty
          style={{ marginBottom: '64px' }}
          description="Es gibt im Moment keine Kurse"
        />
      </div>
    );
  }

  const searchResult = (query: string) => {
    const results = courses
      .map((c) => ({
        ...c,
        search: `${c.name} ${c.category} ${c.outline}`.toLowerCase(),
      }))
      .filter((c) => c.search.includes(query.toLowerCase()));

    return results.map((item) => {
      return {
        value: item.id,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{item.name}</span>
            <span>
              <Tag>{categoryToLabel.get(item.category)}</Tag>
            </span>
          </div>
        ),
      };
    });
  };

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    history.push(`/public/courses/${value}`);
  };

  const onChange = (checkedList: string[], key: string) => {
    if (key === '1') {
      setCheckedList1(checkedList);
      setIndeterminate1(
        !!checkedList.length && checkedList.length < default1.length
      );
      setCheckAll1(checkedList.length === default1.length);
    }
    if (key === '2') {
      setCheckedList2(checkedList);
      setIndeterminate2(
        !!checkedList.length && checkedList.length < default1.length
      );
      setCheckAll2(checkedList.length === default1.length);
    }
    if (key === '3') {
      setCheckedList3(checkedList);
      setIndeterminate3(
        !!checkedList.length && checkedList.length < default1.length
      );
      setCheckAll3(checkedList.length === default1.length);
    }
  };

  const onCheckAllChange = (e, key: string) => {
    if (key === '1') {
      setCheckedList1(e.target.checked ? default1 : []);
      setIndeterminate1(false);
      setCheckAll1(e.target.checked);
    }
    if (key === '2') {
      setCheckedList2(e.target.checked ? default2 : []);
      setIndeterminate2(false);
      setCheckAll2(e.target.checked);
    }
    if (key === '3') {
      setCheckedList3(e.target.checked ? default3 : []);
      setIndeterminate3(false);
      setCheckAll3(e.target.checked);
    }
    if (key === '4') {
      setCheckAll4(e.target.checked);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.logo}>
          <Icons.Logo />
          <Title style={{ margin: '0px 0px 0px 8px' }} size="h3">
            Corona School
          </Title>
        </div>
        <button
          type="button"
          className={classes.filterButton}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          Filter anzeigen
        </button>
      </div>
      <div className={classes.main}>
        <Title size="h2">Alle Kurse</Title>
        <div className={classes.searchContainer}>
          <AutoComplete
            dropdownMatchSelectWidth={252}
            style={{ width: '100%' }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
          >
            <Input.Search
              size="large"
              placeholder="Ich suche nach..."
              enterButton
            />
          </AutoComplete>
        </div>

        {courses
          .filter(
            (c) =>
              c.tags.find(
                (t) =>
                  checkedList1.includes(t.name) ||
                  checkedList2.includes(t.name) ||
                  checkedList3.includes(t.name)
              ) ||
              (c.tags.length === 0 && checkAll4)
          )
          .map((c) => {
            return (
              <MyCourseCard
                key={c.id}
                course={c}
                redirect={`/public/courses/${c.id}`}
              />
            );
          })}
      </div>

      <div
        className={classNames(classes.sideNav, {
          [classes.navOpen]: filterOpen,
        })}
      >
        <button
          type="button"
          className={classes.closeButton}
          onClick={() => setFilterOpen(false)}
        >
          <Icons.Close />
        </button>
        <Title size="h2" style={{ margin: 0 }}>
          Filter
        </Title>
        <div className={classes.checkboxContainer}>
          <Checkbox
            indeterminate={indeterminate1}
            onChange={(e) => onCheckAllChange(e, '1')}
            checked={checkAll1}
          >
            AGs
          </Checkbox>
          <Checkbox.Group
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '16px',
            }}
            options={default1 || []}
            value={checkedList1}
            onChange={(checkedList: string[]) => onChange(checkedList, '1')}
          />
        </div>
        <div className={classes.checkboxContainer}>
          <Checkbox
            indeterminate={indeterminate2}
            onChange={(e) => onCheckAllChange(e, '2')}
            checked={checkAll2}
          >
            Repetitorium
          </Checkbox>
          <Checkbox.Group
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '16px',
            }}
            options={default2 || []}
            value={checkedList2}
            onChange={(checkedList: string[]) => onChange(checkedList, '2')}
          />
        </div>
        <div className={classes.checkboxContainer}>
          <Checkbox
            indeterminate={indeterminate3}
            onChange={(e) => onCheckAllChange(e, '3')}
            checked={checkAll3}
          >
            Lern-Coaching
          </Checkbox>
          <Checkbox.Group
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '16px',
            }}
            options={default3 || []}
            value={checkedList3}
            onChange={(checkedList: string[]) => onChange(checkedList, '3')}
          />
        </div>
        <div className={classes.checkboxContainer}>
          <Checkbox
            indeterminate={false}
            onChange={(e) => onCheckAllChange(e, '4')}
            checked={checkAll4}
          >
            Sonstige
          </Checkbox>
        </div>
      </div>
    </div>
  );
};

export default PublicCourse;
