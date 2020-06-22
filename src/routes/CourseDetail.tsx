import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';

import { ApiContext } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext';
import {
  ParsedCourseOverview,
  CourseState,
  SubCourse,
  Course,
} from '../types/Course';
import { Title, Text } from '../components/Typography';
import { Tag } from '../components/Tag';
import 'moment/locale/de';
import {
  DeleteOutlined,
  MailOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
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
  Input,
} from 'antd';
import { parseCourse } from '../utils/CourseUtil';

import { tags } from '../components/forms/CreateCourse';
import { ModalContext } from '../context/ModalContext';
import Button from '../components/button';
import Icons from '../assets/icons';
import Images from '../assets/images';
import CourseMessageModal from '../components/Modals/CourseMessageModal';

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
    return <div> Wir konnten den Kurs leider nicht finden.</div>;
  }

  const isMyCourse = course.instructors.some((i) => i.id === userId);

  const publishCourse = () => {
    if (!course.subcourse) {
      return;
    }

    const subCourse: SubCourse = {
      instructors: course.subcourse.instructors.map((i) => i.id),
      minGrade: course.subcourse.minGrade,
      maxGrade: course.subcourse.maxGrade,
      maxParticipants: course.subcourse.maxParticipants,
      joinAfterStart: course.subcourse.joinAfterStart,
      published: true,
    };

    api
      .publishSubCourse(course.id, course.subcourse.id, subCourse)
      .then(() => {
        setCourse({
          ...course,
          subcourse: { ...course.subcourse, published: true },
        });
        message.success('Kurs wurde veröffentlicht.');
      })
      .catch((err) => {
        message.error('Kurs wurde veröffentlicht.');
      });
  };

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

    api
      .submitCourse(course.id, apiCourse)
      .then(() => {
        setCourse({ ...course, state: CourseState.SUBMITTED });
        message.success('Kurs  wurde zur Prüfung freigegeben.');
      })
      .catch((err) => {
        message.error('Kurs konnte zur Prüfung freigegeben werden..');
      });
  };

  const cancelCourse = () => {
    api.cancelCourse(course.id).then(() => {
      message.success('Kurs wurde abgesagt.');
      history.push('/courses');
    });
  };

  const renderCourseInformation = () => {
    const menu = (
      <Menu
        onClick={(param) => {
          if (param.key === '1') {
            publishCourse();
          }
          if (param.key === '2') {
            submitCourse();
          }
          if (param.key === '3') {
            modalContext.setOpenedModal('courseMessageModal');
          }
          if (param.key === '4') {
            cancelCourse();
          }
        }}
      >
        {!course.subcourse.published && (
          <Menu.Item key="1" icon={<GlobalOutlined />}>
            Veröffentlichen
          </Menu.Item>
        )}
        {course.state === CourseState.CREATED && (
          <Menu.Item key="2" icon={<CheckCircleOutlined />}>
            Zur Prüfung freigeben
          </Menu.Item>
        )}
        <Menu.Item key="3" icon={<MailOutlined />}>
          Nachricht senden
        </Menu.Item>
        {course.state !== CourseState.CANCELLED && (
          <Menu.Item key="4" icon={<DeleteOutlined />}>
            Löschen
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <div className={classes.statusContainer}>
        <div className={classes.headerContainer}>
          <div>
            <Title size="h1" style={{ margin: '0px 10px' }}>
              {course.name}
            </Title>
            <Title size="h5" style={{ margin: '-4px 10px 0px 10px' }}>
              {course.outline}
            </Title>
          </div>
          <div className={classes.actionContainer}>
            {isMyCourse && (
              <Dropdown.Button overlay={menu}>Bearbeiten</Dropdown.Button>
            )}
            {canJoinCourse() && (
              <AntdButton
                onClick={() => {
                  if (course.subcourse.joined) {
                    api
                      .leaveCourse(course.id, course.subcourse.id, userId)
                      .then(() => {
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
                    api
                      .joinCourse(course.id, course.subcourse.id, userId)
                      .then(() => {
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
                }}
              >
                {course.subcourse.joined ? 'Verlassen' : 'Teilnehmen'}
              </AntdButton>
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
                    : '#ffcc11'
                }
                style={{ fontSize: '12px', margin: 0 }}
              >
                {course.state}
              </Tag>
            </Descriptions.Item>
          )}
          {isMyCourse && (
            <Descriptions.Item label="Sichtbarkeit">
              {course.subcourse?.published ? 'Öffentlich' : 'Privat'}
            </Descriptions.Item>
          )}
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
            {course.subcourse.instructors
              .map((i) => `${i.firstname} ${i.lastname}`)
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
              <i>"{course.description}"</i>
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tags">
            {course.tags.map((t) => {
              return <Tag>{t.name}</Tag>;
            })}
          </Descriptions.Item>
        </Descriptions>
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
