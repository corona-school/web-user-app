import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';

import { ApiContext } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext';
import {
  ParsedCourseOverview,
  CourseState,
  Course,
  SubCourse,
} from '../types/Course';
import { Title, Text } from '../components/Typography';
import { Tag } from '../components/Tag';
import 'moment/locale/de';
import {
  DeleteOutlined,
  MailOutlined,
  CheckCircleOutlined,
  DownOutlined,
} from '@ant-design/icons';
import classes from './CourseDetail.module.scss';
import { UserContext } from '../context/UserContext';
import {
  Empty,
  Descriptions,
  Menu,
  Dropdown,
  message,
  Button as AntdButton,
  List,
  Tooltip,
} from 'antd';
import { parseCourse } from '../utils/CourseUtil';
import {
  CategoryToLabel,
  CourseStateToLabel,
} from '../components/cards/MyCourseCard';

import { tags } from '../components/forms/CreateCourse';
import { ModalContext } from '../context/ModalContext';
import CourseMessageModal from '../components/Modals/CourseMessageModal';
import { dev } from '../api/config';

moment.locale('de');

const CourseDetail = () => {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<ParsedCourseOverview | null>(null);
  const { id } = useParams();

  const api = useContext(ApiContext);
  const userContext = useContext(UserContext);
  const isStudent = userContext.user.type === 'student';

  const history = useHistory();

  const auth = useContext(AuthContext);
  const modalContext = useContext(ModalContext);
  const userId = auth.credentials.id;

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .getCourse(id)
        .then((course) => {
          setCourse(parseCourse(course));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course || !course.subcourse) {
    return <div>Wir konnten den Kurs leider nicht finden.</div>;
  }

  const isMyCourse = course.instructors.some((i) => i.id === userId);

  const submitCourse = () => {
    const category = course.category;
    const tagObj = tags.get(category);

    const apiCourse: Course = {
      instructors: course.instructors.map((i) => i.id),
      name: course.name,
      outline: course.outline,
      description: course.description,
      category: course.category,
      tags: course.tags.map(
        (t) => tagObj.find((o) => o.name === t.name)?.identifier
      ),
      submit: true,
    };

    const apiSubCourse: SubCourse = {
      minGrade: course.subcourse.minGrade,
      maxGrade: course.subcourse.maxGrade,
      instructors: course.subcourse.instructors.map((i) => i.id),
      joinAfterStart: course.subcourse.joinAfterStart,
      maxParticipants: course.subcourse.maxParticipants,
      published: true,
    };

    api
      .submitCourse(course.id, apiCourse)
      .then(() => {
        setCourse({ ...course, state: CourseState.SUBMITTED });
        return api.publishSubCourse(
          course.id,
          course.subcourse.id,
          apiSubCourse
        );
      })
      .then(() => {
        message.success('Kurs wurde zur Prüfung freigegeben.');
      })
      .catch((err) => {
        if (dev) console.error(err);
        message.error('Kurs konnte nicht zur Prüfung freigegeben werden.');
      });
  };

  const cancelCourse = () => {
    api.cancelCourse(course.id).then(() => {
      message.success('Kurs wurde abgesagt.');
      history.push('/courses');
    });
  };

  const joinCourse = () => {
    if (course.subcourse.joined) {
      api.leaveCourse(course.id, course.subcourse.id, userId).then(() => {
        setCourse({
          ...course,
          subcourse: {
            ...course.subcourse,
            participants: course.subcourse.participants - 1,
            joined: false,
          },
        });
        message.success('Du hast den Kurs verlassen.');
      });
    } else {
      api.joinCourse(course.id, course.subcourse.id, userId).then(() => {
        setCourse({
          ...course,
          subcourse: {
            ...course.subcourse,
            participants: course.subcourse.participants + 1,
            joined: true,
          },
        });
        message.success('Du bist dem Kurs beigetreten.');
      });
    }
  };

  const renderCourseInformation = () => {
    const getMenu = () => (
      <Menu
        onClick={(param) => {
          if (param.key === '2') {
            submitCourse();
          }
          if (param.key === '3') {
            modalContext.setOpenedModal('courseMessageModal');
          }
          if (param.key === '4') {
            cancelCourse();
          }
          if (param.key === '5') {
            history.push(`/courses/edit/${course.id}`);
          }
        }}
      >
        {course.state === CourseState.CREATED && (
          <Menu.Item key="2" icon={<CheckCircleOutlined />}>
            Zur Prüfung freigeben
          </Menu.Item>
        )}
        <Menu.Item
          key="3"
          icon={<MailOutlined />}
          disabled={course.subcourse.participantList.length === 0}
        >
          Nachricht senden
        </Menu.Item>
        {course.state !== CourseState.CANCELLED && (
          <Menu.Item key="4" icon={<DeleteOutlined />}>
            Löschen
          </Menu.Item>
        )}
        <Menu.Item key="5" icon={<CheckCircleOutlined />}>
          Bearbeiten
        </Menu.Item>
      </Menu>
    );

    const instructors = [
      ...course.subcourse.instructors,
      ...course.instructors,
    ].map((i) => `${i.firstname} ${i.lastname}`);

    return (
      <div className={classes.statusContainer}>
        <div className={classes.headerContainer}>
          <div>
            <Title size="h1" style={{ margin: '0px 20px 10px 8px' }}>
              {course.name}
            </Title>
            <Title size="h5" style={{ margin: '-4px 10px 0px 10px' }}>
              {course.outline}
            </Title>
          </div>
          <div className={classes.actionContainer}>
            {isMyCourse && (
              <Dropdown overlay={getMenu()}>
                {course.state === CourseState.CREATED ? (
                  <AntdButton
                    type="primary"
                    style={{
                      backgroundColor: '#FCD95C',
                      borderColor: '#FCD95C',
                      color: '#373E47',
                    }}
                    onClick={() => {
                      submitCourse();
                    }}
                  >
                    <CheckCircleOutlined /> Zur Prüfung freigeben
                  </AntdButton>
                ) : (
                  <AntdButton>
                    Einstellungen <DownOutlined />
                  </AntdButton>
                )}
              </Dropdown>
            )}
          </div>
        </div>

        <Descriptions
          column={3}
          size={'small'}
          style={{ margin: '10px', maxWidth: '700px' }}
        >
          {isMyCourse && (
            <Descriptions.Item label="Status">
              <Tag
                background={
                  course.state === CourseState.CANCELLED ||
                  course.state === CourseState.DENIED
                    ? '#F4486D'
                    : '#FCD95C'
                }
                color={
                  course.state === CourseState.CANCELLED ||
                  course.state === CourseState.DENIED
                    ? 'white'
                    : '#373E47'
                }
                style={{ fontSize: '12px', margin: 0 }}
              >
                {CourseStateToLabel.get(course.state)}
              </Tag>
            </Descriptions.Item>
          )}
          {isMyCourse && (
            <Descriptions.Item label="Sichtbarkeit">
              {course.subcourse?.published ? (
                'Öffentlich'
              ) : (
                <Tooltip title="Der Kurs ist nur für dich sichtbar.">
                  <span>Privat</span>
                </Tooltip>
              )}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Kategorie">
            {CategoryToLabel.get(course.category)}
          </Descriptions.Item>
          <Descriptions.Item label="Teilnehmer">
            {course.subcourse.participants}/{course.subcourse.maxParticipants}
          </Descriptions.Item>
          <Descriptions.Item label="Klasse">
            {course.subcourse.minGrade}-{course.subcourse.maxGrade}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="Anzahl">
            {course.subcourse.lectures.length} Lektionen
          </Descriptions.Item>
          <Descriptions.Item label="Dauer">
            {course.subcourse.lectures
              .map((l) => l.duration + 'min.')
              .join(', ')}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="Tutoren">
            {instructors
              .filter((item, pos) => instructors.indexOf(item) === pos)
              .join(', ')}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          size="small"
          layout="vertical"
          column={1}
          style={{ margin: '10px', maxWidth: '700px' }}
        >
          <Descriptions.Item label="Beschreibung">
            <Text large>
              <i style={{ whiteSpace: 'pre-wrap' }}>{course.description}</i>
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tags">
            {course.tags.map((t) => {
              return <Tag>{t.name}</Tag>;
            })}
          </Descriptions.Item>
        </Descriptions>
        {canJoinCourse() && (
          <AntdButton
            type="primary"
            style={{
              backgroundColor: course.subcourse.joined ? '#F4486D' : '#FCD95C',
              borderColor: course.subcourse.joined ? '#F4486D' : '#FCD95C',
              color: course.subcourse.joined ? 'white' : '#373E47',
              width: '120px',
              margin: '0px 10px',
            }}
            onClick={joinCourse}
          >
            {course.subcourse.joined ? 'Verlassen' : 'Teilnehmen'}
          </AntdButton>
        )}
        {isMyCourse && (
          <div>
            <Title size="h3" style={{ margin: '0px 10px' }}>
              Teilnehmer
            </Title>
            <div>{renderParticipants()}</div>
          </div>
        )}
      </div>
    );
  };

  const renderParticipants = () => {
    if (!course.subcourse) {
      return;
    }
    if (course.subcourse.participants === 0) {
      return <Empty description="Du hast noch keine Teilnehmer"></Empty>;
    }

    return (
      <div>
        <List
          style={{
            margin: '10px',
            maxWidth: '800px',
            background: 'white',
            padding: '4px',
          }}
          itemLayout="horizontal"
          dataSource={course.subcourse.participantList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <div>{item.schooltype}</div>,
                <span>{item.grade} Klasse</span>,
              ]}
            >
              <List.Item.Meta
                title={item.firstname + ' ' + item.lastname}
                description={<a href={`mailto:${item.email}`}>{item.email}</a>}
              />
            </List.Item>
          )}
        />
      </div>
    );
  };
  const canJoinCourse = () => {
    if (!course.subcourse || isStudent) {
      return false;
    }

    if (course.subcourse.participants === course.subcourse.maxParticipants) {
      return false;
    }

    if (
      userContext.user.grade >= course.subcourse.minGrade &&
      userContext.user.grade <= course.subcourse.maxGrade
    ) {
      return true;
    }

    return false;
  };

  const renderLectures = () => {
    if (!course.subcourse) {
      return <div>Keine Lektionen geplant.</div>;
    }

    return course.subcourse.lectures
      .sort((a, b) => a.start - b.start)
      .map((l, i) => {
        return (
          <div className={classes.newsContent}>
            <div className={classes.newsHeadline}>
              <Tag>{moment(l.start).format('DD.MM')}</Tag>
              <Tag>
                {moment(l.start).format('HH:mm')}-
                {moment(l.start).add(l.duration, 'minutes').format('HH:mm')} Uhr
              </Tag>
              <Title bold size="h5">
                Lektion {i + 1}
              </Title>
            </div>

            <Text>
              Die {i + 1}te Lektion findet {moment(l.start).fromNow()} statt und
              dauert ungefähr {l.duration}min. Der Kurs ist für Schüler in der{' '}
              {course.subcourse.minGrade}-{course.subcourse.maxGrade} Klasse.{' '}
              <br />
              Tutor: {l.instructor.firstname} {l.instructor.lastname}
            </Text>
          </div>
        );
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.topGrid}>
        {renderCourseInformation()}

        <div>
          <div className={classes.newsContainer}>
            <Title size="h3" bold>
              Lektionen
            </Title>

            <div className={classes.newsContentContainer}>
              {renderLectures()}
            </div>
          </div>
        </div>
      </div>
      <CourseMessageModal
        courseId={course.id}
        subcourseId={course.subcourse.id}
      />
    </div>
  );
};

export default CourseDetail;
