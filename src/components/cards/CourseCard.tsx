import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Col, Row, Tag } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { Text, Title } from '../Typography';
import { ParsedCourseOverview } from '../../types/Course';

import classes from './CourseCard.module.scss';

import Icons from '../../assets/icons';
import Images from '../../assets/images';

interface Props {
  course: ParsedCourseOverview;
  customCourseLink?: string;
}

const CourseCard: React.FC<Props> = ({ course, customCourseLink }) => {
  return (
    <div className={classes.marginContainer}>
      <Link
        className={classes.baseContainer}
        to={customCourseLink ?? `/courses/${course.id}`}
      >
        <div className={classes.coverImageContainer}>
          <img
            className={classes.coverImage}
            src={course.image ?? (Images.DefaultCourseCover as string)}
            alt="Cover-Bild des Kurses"
          />
          <Tag
            icon={<CalendarOutlined />}
            color="#7082e0"
            className={classes.dateTag}
          >
            ab{' '}
            {moment.unix(course.subcourse?.lectures[0]?.start).format('DD.MM.')}
          </Tag>
        </div>

        <div className={classes.contentContainer}>
          <div>
            <Title size="h4" bold className={classes.title}>
              {course.name}
            </Title>
            <Text large className={classes.text}>
              {course.outline}
            </Text>
          </div>
          <div>
            <Row justify="end">
              <Col>
                <Tag
                  icon={<Icons.Hashtag />}
                  color="#e6e6e6"
                  className={classes.TermineTag}
                >
                  {course.subcourse?.lectures.length} Termine
                </Tag>
              </Col>
            </Row>
            <div className={classes.infoContainer}>
              <div className={classes.info}>
                <Icons.School />
                <Text large>
                  {course.subcourse?.minGrade}. - {course.subcourse?.maxGrade}.
                  Klasse
                </Text>
              </div>
              <div className={classes.info}>
                <Icons.Team />
                <Text large>
                  {course.subcourse?.participants} /{' '}
                  {course.subcourse?.maxParticipants}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
