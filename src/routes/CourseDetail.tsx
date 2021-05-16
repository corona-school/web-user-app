/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import moment from 'moment';

import {
  DeleteOutlined,
  MailOutlined,
  CheckCircleOutlined,
  DownOutlined,
  ShareAltOutlined,
  WhatsAppOutlined,
  CopyOutlined,
  UserAddOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  Empty,
  Descriptions,
  Menu,
  Dropdown,
  message,
  Button as AntdButton,
  List,
  Tooltip,
  Popconfirm,
  Row,
  Col,
  Popover,
} from 'antd';
import classnames from 'classnames';
import AddInstructorModal from '../components/Modals/AddInstructorModal';
import { ApiContext } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext';
import {
  ParsedCourseOverview,
  CourseState,
  Course,
  SubCourse,
  CourseParticipant,
  Tag as CourseTag,
} from '../types/Course';
import { Title, Text } from '../components/Typography';
import { Tag } from '../components/Tag';
import 'moment/locale/de';
import classes from './CourseDetail.module.scss';
import { UserContext } from '../context/UserContext';
import { parseCourse } from '../utils/CourseUtil';
import {
  CategoryToLabel,
  CourseStateToLabel,
} from '../components/cards/MyCourseCard';

import { ModalContext } from '../context/ModalContext';
import CourseMessageModal from '../components/Modals/CourseMessageModal';
import { apiURL, dev } from '../api/config';
import CourseDeletionConfirmationModal from '../components/Modals/CourseDeletionConfirmationModal';
import CourseConfirmationModal from '../components/Modals/CourseConfirmationModal';
import AddCourseGuestModal from '../components/Modals/AddCourseGuestModal';
import Icons from '../assets/icons';
import SearchParticipant from '../components/course/SearchParticipant';
import SortParticipant from '../components/course/SortParticipant';
import Button from '../components/button';
import Images from '../assets/images';
import { Spinner } from '../components/loading/Spinner';

moment.locale('de');

interface Props {
  id?: string;
  setIsWaitingList?: (boolean) => void;
  publicView?: boolean;
}

// activate 60 minutes before start and 60 minutes after end of a lecture
const INSTRUCTOR_JOIN_TIME = 60;
const STUDENTT_JOIN_TIME = 10;

const CourseDetail = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<ParsedCourseOverview | null>(null);
  const [isLoadingVideoChat, setIsLoadingVideoChat] = useState(false);
  const [courseConfirmationMode, setCourseConfirmationMode] = useState<
    'quit' | 'join'
  >('join'); // Mode for the confirmation modal
  const [isCustomShareMenuVisible, setIsCustomShareMenuVisible] = useState(
    false
  );
  const [tags, setTags] = useState<CourseTag[]>([]);
  const [participantList, setParticipantList] = useState<CourseParticipant[]>(
    []
  );
  const [enteredFilter, setEnteredFilter] = useState('');

  const [loadingCerts, setLoadingCerts] = useState<Set<string>>(new Set());
  const loadingCertsRef = useRef(loadingCerts);

  const { id: urlParamID } = useParams<{ id: string }>();
  const id = props.id ?? urlParamID;

  const api = useContext(ApiContext);
  const userContext = useContext(UserContext);
  const isStudent = userContext.user.type === 'student';

  const history = useHistory();

  const auth = useContext(AuthContext);
  const modalContext = useContext(ModalContext);
  const userId = auth.credentials.id;

  const updateCourseDetails = () => {
    setLoading(true);
    api
      .getCourse(id)
      .then((course) => {
        const parsedCourse = parseCourse(course);
        setCourse(parsedCourse);
        setParticipantList(parsedCourse.subcourse.participantList);

        if (props.setIsWaitingList) {
          props.setIsWaitingList(
            parsedCourse.subcourse
              ? parsedCourse.subcourse.participants ===
                  parsedCourse.subcourse.maxParticipants
              : false
          );
        }
        return api.getCourseTags();
      })
      .then((response) => {
        setTags(response);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      updateCourseDetails();
    }
  }, [id]);

  // search Participants
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !loading &&
        course &&
        course.subcourse &&
        course.subcourse.participantList
      ) {
        const filteredParticipants = course.subcourse.participantList.filter(
          (data) => {
            if (enteredFilter.length === 0) return data;
            if (
              data.firstname
                .toUpperCase()
                .includes(enteredFilter.toUpperCase()) ||
              data.lastname
                .toUpperCase()
                .includes(enteredFilter.toUpperCase()) ||
              data.email.toUpperCase().includes(enteredFilter.toUpperCase()) ||
              data.grade.toFixed().includes(enteredFilter)
            ) {
              return data;
            }
            return null;
          }
        );
        setParticipantList(filteredParticipants);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [loading, enteredFilter]);

  if (loading) {
    return <Spinner message="Der Kurs wird geladen..." />;
  }

  if (!course || !course.subcourse) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90vh',
        }}
      >
        <Images.NotFound />
        <Title size="h3">Kurse konnte nicht gefunden werden.</Title>
        <Button
          className={classes.retryButton}
          backgroundColor="#4E6AE6"
          color="#ffffff"
          onClick={() => history.go(0)}
        >
          Erneut versuchen
        </Button>
      </div>
    );
  }

  const isMyCourse = course.instructors.some((i) => i.id === userId);

  const submitCourse = () => {
    const { category } = course;
    const tagObj = tags.filter((t) => t.category === category);

    const apiCourse: Course = {
      instructors: course.instructors.map((i) => i.id),
      name: course.name,
      outline: course.outline,
      description: course.description,
      category: course.category,
      tags: course.tags.map((t) => tagObj.find((o) => o.name === t.name)?.id),
      submit: true,
      allowContact: course.allowContact,
      correspondentID: course.correspondentID,
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

  const joinCourse = () => {
    if (course.subcourse.joined) {
      setCourseConfirmationMode('quit');
      modalContext.setOpenedModal('courseConfirmationModal');
    } else {
      setCourseConfirmationMode('join');
      modalContext.setOpenedModal('courseConfirmationModal');
    }
  };

  const joinWaitingList = () => {
    if (course.subcourse.onWaitingList) {
      api
        .leaveCourseWaitingList(course.id, course.subcourse.id, userId)
        .then(() => {
          setCourse({
            ...course,
            subcourse: {
              ...course.subcourse,
              onWaitingList: false,
            },
          });
          message.success('Du hast die Warteliste verlassen.');
        });
    } else {
      api
        .joinCourseWaitingList(course.id, course.subcourse.id, userId)
        .then(() => {
          setCourse({
            ...course,
            subcourse: {
              ...course.subcourse,
              onWaitingList: true,
            },
          });
          message.success(
            'Du wurdest erfolgreich zur Warteliste hinzugefügt. Wir benachrichtigen dich, falls ein Platz frei wird. Schau also regelmäßig in deine Mails.',
            6 // for longer time
          );
        })
        .catch(() => {
          message.error(
            'Es ist ein Fehler aufgetreten. Bitte versuche es später noch einmal '
          );
        });
    }
  };

  const joinBBBmeeting = () => {
    setIsLoadingVideoChat(true);
    api
      .joinBBBmeeting(course.id, course.subcourse.id)
      .then((res) => {
        setIsLoadingVideoChat(false);
        // use window.location to not have problems with popup blocking
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.location.href = (res as any).url;
      })
      .catch((err) => {
        setIsLoadingVideoChat(false);
        if (err?.response?.status === 400) {
          message.error(
            'Der Videochat wurde noch nicht gestartet. Du musst auf die*den Kursleiter*in warten. Probiere es später bzw. kurz vorm Beginn des Kurses noch einmal.'
          );
        } else {
          message.error(
            'Ein unerwarter Fehler ist aufgetreten. Versuche, die Seite neuzuladen.'
          );
        }
      });
  };

  const joinTestMeeting = () => {
    const newWindow = window.open(
      `${apiURL}/course/test/meeting/join?Token=${auth.credentials.token}`,
      '_blank',
      'noopener,noreferrer'
    );
    if (newWindow) newWindow.opener = null;
  };

  const openWriteMessageModal = () => {
    modalContext.setOpenedModal('courseMessageModal');
  };

  const shareData = {
    title: course.name,
    text: 'Guck dir diesen kostenlosen Kurs der Corona School an!',
    url: `${window.location.protocol}//${window.location.hostname}/public/courses/${course.id}`,
  };

  const copyCourseLink = async () => {
    if (!navigator.clipboard) {
      message.error('Dein Browser unterstützt das nicht 😔');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareData.url);

      message.success('Link wurde in die Zwischenablage kopiert!');
    } catch {
      message.error('Link konnte nicht kopiert werden!');
    }
  };

  const whatsAppShareURL = `whatsapp://send?text=${shareData.text} ${shareData.url}`;

  const hasJoiningRights = () => {
    return !(!course.subcourse || isStudent);
  };

  const hasEnded = () => {
    const lectures = course.subcourse.lectures.sort(
      (a, b) => a.start - b.start
    );
    const lastLecture = lectures[lectures.length - 1];
    if (lastLecture != null) {
      const lectureEnd = moment
        .unix(lastLecture.start)
        .add(lastLecture.duration, 'minutes');

      return moment().isAfter(lectureEnd);
    }

    return false;
  };

  const canDisjoinCourse = () => {
    return hasJoiningRights() && course.subcourse.joined && !hasEnded();
  };

  const canDisjoinWaitingList = () => {
    return hasJoiningRights && course.subcourse.onWaitingList;
  };

  const getJoinBtnDisabledReason = () => {
    if (
      !(
        userContext.user.grade >= course.subcourse.minGrade &&
        userContext.user.grade <= course.subcourse.maxGrade
      )
    ) {
      return 'Du kannst diesem Kurs nicht beitreten, da du nicht in der Zielgruppe bist.';
    }
    if (
      !course.subcourse.joinAfterStart &&
      course.subcourse.lectures.some((l) =>
        moment.unix(l.start).isBefore(moment())
      )
    ) {
      return 'Du kannst diesem Kurs nicht beitreten, da er bereits begonnen hat und es nicht möglich ist, im Nachhinein beizutreten.';
    }
    if (course.subcourse.participants >= course.subcourse.maxParticipants) {
      return 'Du kannst diesem Kurs nicht beitreten, da er voll ist.';
    }
    if (course.subcourse.joined) {
      if (!hasJoiningRights()) {
        return 'Du hast keine Berechtigung, um diesen Kurs zu verlassen.';
      }
      if (hasEnded()) {
        return 'Dieser Kurs hat bereits geendet. Aus statistischen Gründen kannst du ihn nun nicht mehr verlassen.';
      }
    }
    if (course.subcourse.onWaitingList) {
      return 'Du hast keine Berechtigung, um die Warteliste zu verlassen.';
    }

    return null;
  };

  const antdShareMenu = (
    <Menu>
      <Menu.Item icon={<CopyOutlined />} key="copyLink">
        <span onClick={copyCourseLink}>Link kopieren</span>
      </Menu.Item>
      <Menu.Item icon={<WhatsAppOutlined />} key="shareWhatsApp">
        <a
          href={whatsAppShareURL}
          data-action="share/whatsapp/share"
          className={classes.shareLink}
        >
          WhatsApp
        </a>
      </Menu.Item>
    </Menu>
  );

  const tsNavigator = navigator; // so that typescript compiles with share

  const shareCourse = () => {
    if (tsNavigator.share) {
      setIsCustomShareMenuVisible(false);
      tsNavigator.share(shareData);
    } else {
      setIsCustomShareMenuVisible(true);
    }
  };

  const isEligibleForJoining = () => {
    // correct values?
    if (!hasJoiningRights()) {
      return false;
    }

    // already started or late join?
    const hasCourseStarted = course.subcourse.lectures.some((l) =>
      moment.unix(l.start).isBefore(moment())
    );
    if (!course.subcourse.joinAfterStart && hasCourseStarted) {
      return false;
    }

    // fitting grades?
    return (
      userContext.user.grade >= course.subcourse.minGrade &&
      userContext.user.grade <= course.subcourse.maxGrade
    );
  };

  const canJoinWaitingList = () => {
    return (
      isEligibleForJoining() &&
      course.subcourse.participants >= course.subcourse.maxParticipants
    );
  };

  const canJoinCourse = () => {
    return (
      isEligibleForJoining() &&
      !course.subcourse.joined &&
      course.subcourse.participants < course.subcourse.maxParticipants
    );
  };

  const joinButtonTitle = () => {
    if (canJoinCourse()) {
      return `Teilnehmen${
        course.subcourse.onWaitingList ? ' und Warteliste verlassen' : ''
      }`;
    }
    if (course.subcourse.joined) {
      return 'Verlassen';
    }
    if (course.subcourse.onWaitingList) {
      return 'Warteliste verlassen';
    }

    return 'auf Warteliste';
  };

  const joinButtonAction = () => {
    if (canJoinCourse() || canDisjoinCourse()) {
      joinCourse();
    } else if (canJoinWaitingList() || canDisjoinWaitingList()) {
      joinWaitingList();
    }
  };

  const isLoadingParticipantCertificate = (participantID: string) => {
    return loadingCertsRef.current.has(participantID);
  };

  const issueParticipantCertificate = (participantID: string) => {
    if (isLoadingParticipantCertificate(participantID)) {
      // already loading that cert)
      return;
    }
    setLoadingCerts(new Set(loadingCertsRef.current.add(participantID)));
    api
      .issueCourseCertificates(course.id, course.subcourse.id, [participantID])
      .then(() => {
        message.success('Dem/Der Schüler*in wurde die Teilnahme bestätigt.');
      })
      .catch((err) => {
        if (dev) console.error(err);
        message.error('Es ist ein Fehler aufgetreten!');
      })
      .finally(() => {
        loadingCertsRef.current.delete(participantID);
        setLoadingCerts(new Set(loadingCertsRef.current));
      });
  };

  const getTodaysLectures = () => {
    return course.subcourse?.lectures?.filter((l) =>
      moment.unix(l.start).isSame(moment(), 'day')
    );
  };

  const videoChatHint = () => {
    const preJoinTime = isStudent ? INSTRUCTOR_JOIN_TIME : STUDENTT_JOIN_TIME;

    return `Der Link zum Video-Chat wird erst ${preJoinTime} Minuten vor dem Start deines Kurses aktiv.`;
  };

  const shouldEnableVideoChat = () => {
    const lecturesToday = getTodaysLectures()?.sort(
      (a, b) => a.start - b.start
    );
    const firstLecture = lecturesToday?.[0];
    const lastLecture = lecturesToday?.[lecturesToday.length - 1];

    if (!firstLecture || !lastLecture) {
      return false;
    }
    const preJoinTime = isStudent ? INSTRUCTOR_JOIN_TIME : STUDENTT_JOIN_TIME; // minutes
    const start = moment
      .unix(firstLecture.start)
      .subtract(preJoinTime, 'minutes');
    const end = moment
      .unix(lastLecture.start)
      .add(lastLecture.duration, 'minutes')
      .add(INSTRUCTOR_JOIN_TIME, 'minutes');

    return moment().isBetween(start, end);
  };

  const renderLectures = () => {
    if (!course.subcourse) {
      return <div>Keine Lektionen geplant.</div>;
    }

    return course.subcourse.lectures
      .sort((a, b) => a.start - b.start)
      .map((l, i) => {
        return (
          <Col lg={24} md={12} sm={24} key={l.id}>
            <div className={classes.newsHeadline}>
              <Tag>{moment.unix(l.start).format('DD.MM')}</Tag>
              <Tag>
                {moment.unix(l.start).format('HH:mm')}-
                {moment
                  .unix(l.start)
                  .add(l.duration, 'minutes')
                  .format('HH:mm')}{' '}
                Uhr
              </Tag>
              <Title bold size="h5">
                Lektion {i + 1}
              </Title>
            </div>

            <Text>
              Die {i + 1}te Lektion{' '}
              {moment.unix(l.start).isAfter(Date.now()) ? 'findet' : 'fand'}{' '}
              {moment.unix(l.start).fromNow()} statt und dauert
              {moment.unix(l.start).isAfter(Date.now())
                ? ''
                : 'e'} ungefähr {l.duration}min. Der Kurs ist für Schüler in der{' '}
              {course.subcourse.minGrade}-{course.subcourse.maxGrade} Klasse.{' '}
              <br />
              Tutor: {l.instructor.firstname} {l.instructor.lastname}
            </Text>
          </Col>
        );
      });
  };

  const renderParticipants = () => {
    if (!course.subcourse) {
      return null;
    }
    if (course.subcourse.participants === 0) {
      return <Empty description="Du hast noch keine Teilnehmer*innen" />;
    }

    return (
      <div>
        <div>
          <Row gutter={16}>
            <Col
              xxl={{ span: 12, offset: 12 }}
              md={{ span: 18, offset: 6 }}
              sm={24}
              xs={24}
            >
              <SearchParticipant
                inputValue={(value) => setEnteredFilter(value)}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <SortParticipant
                setParticipantList={(value) => setParticipantList(value)}
                getParticipantList={participantList}
              />
            </Col>
          </Row>
        </div>
        <List
          className={classes.participantList}
          // itemLayout="horizontal"
          dataSource={participantList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <div>{item.schooltype}</div>,
                <span>{item.grade} Klasse</span>,
                <Popconfirm
                  title={`Soll ${item.firstname} wirklich ein Zertifikat zugeschickt bekommen?`}
                  icon={<QuestionCircleOutlined />}
                  okText="Bestätigen"
                  cancelText="Abbrechen"
                  onConfirm={() => issueParticipantCertificate(item.uuid)}
                  disabled={
                    !hasEnded() || isLoadingParticipantCertificate(item.uuid)
                  }
                >
                  <AntdButton
                    type="primary"
                    disabled={
                      !hasEnded() || isLoadingParticipantCertificate(item.uuid)
                    }
                    loading={isLoadingParticipantCertificate(item.uuid)}
                  >
                    {isLoadingParticipantCertificate(item.uuid)
                      ? 'Wird ausgestellt...'
                      : 'Teilnahmezertifikat ausstellen'}
                  </AntdButton>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={`${item.firstname} ${item.lastname}`}
                description={<a href={`mailto:${item.email}`}>{item.email}</a>}
              />
            </List.Item>
          )}
        />
      </div>
    );
  };
  const renderJoinButton = () => {
    return (
      <AntdButton
        type="primary"
        style={
          !(
            canJoinCourse() ||
            canJoinWaitingList() ||
            canDisjoinCourse() ||
            canDisjoinWaitingList()
          )
            ? {
                backgroundColor: '#727272',
                borderColor: '#727272',
                color: '#ffffff',
                width: '100%',
                height: 'auto',
                overflow: 'hidden',
                whiteSpace: 'normal',
              }
            : {
                backgroundColor:
                  course.subcourse.joined || course.subcourse.onWaitingList
                    ? '#F4486D'
                    : '#FCD95C',
                borderColor:
                  course.subcourse.joined || course.subcourse.onWaitingList
                    ? '#F4486D'
                    : '#FCD95C',
                color:
                  course.subcourse.joined || course.subcourse.onWaitingList
                    ? 'white'
                    : '#373E47',
                width: '100%',
                height: 'auto',
                overflow: 'hidden',
                whiteSpace: 'normal',
              }
        }
        onClick={joinButtonAction}
        disabled={
          !(
            canJoinCourse() ||
            canJoinWaitingList() ||
            canDisjoinCourse() ||
            canDisjoinWaitingList()
          )
        }
      >
        {joinButtonTitle()}
      </AntdButton>
    );
  };
  const renderCourseInformation = () => {
    const getMenu = () => (
      <Menu
        onClick={(param) => {
          if (param.key === '2') {
            submitCourse();
          }
          if (param.key === '3') {
            openWriteMessageModal();
          }
          if (param.key === '4') {
            modalContext.setOpenedModal('courseDeletionConfirmationModal');
          }
          if (param.key === '5') {
            history.push(`/courses/edit/${course.id}`);
          }
          if (param.key === '6') {
            modalContext.setOpenedModal('addInstructorModal');
          }
          if (param.key === '7') {
            modalContext.setOpenedModal('addCourseGuestModal');
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

        {course.state !== CourseState.CANCELLED && (
          <Menu.Item key="6" icon={<UserAddOutlined />}>
            Tutor*in hinzufügen
          </Menu.Item>
        )}

        {course.state === CourseState.ALLOWED && (
          <Menu.Item key="7" icon={<UserAddOutlined />}>
            Gäst*in einladen
          </Menu.Item>
        )}
      </Menu>
    );

    const instructors = [
      ...course.subcourse.instructors,
      ...course.instructors,
    ].map((i) => `${i.firstname} ${i.lastname}`);

    return (
      <div className={classes.statusContainer}>
        <div className={classes.backButtonContainer}>
          <button
            className={classes.backButton}
            onClick={() => {
              if (props.publicView) {
                history.push(
                  history.location.hash.length > 0
                    ? `/public/courses/${history.location.hash}`
                    : '/public/courses'
                );
              } else {
                history.push(
                  history.location.hash.length > 0
                    ? `/courses/overview/${history.location.hash}`
                    : '/courses'
                );
              }
            }}
          >
            <Icons.ChevronLeft />
            Zurück
          </button>
        </div>
        <div className={classes.headerContainer}>
          <Row>
            <Col xxl={20} lg={18} md={17} sm={24}>
              <Title size="h1" style={{ marginBottom: '0px' }}>
                {course.name}
              </Title>
              <Title size="h5">{course.outline}</Title>
            </Col>
            <Col xxl={4} lg={6} md={7} sm={24}>
              <div className={classes.actionContainer}>
                <Row gutter={[6, 6]}>
                  {isMyCourse && (
                    <Col span={24}>
                      <Dropdown overlay={getMenu()}>
                        {course.state === CourseState.CREATED ? (
                          <AntdButton
                            type="primary"
                            style={{
                              backgroundColor: '#FCD95C',
                              borderColor: '#FCD95C',
                              color: '#373E47',
                              width: '100%',
                            }}
                            onClick={() => {
                              submitCourse();
                            }}
                          >
                            <CheckCircleOutlined /> Zur Prüfung freigeben
                          </AntdButton>
                        ) : (
                          <AntdButton
                            style={{
                              width: '100%',
                            }}
                          >
                            Einstellungen <DownOutlined />
                          </AntdButton>
                        )}
                      </Dropdown>
                    </Col>
                  )}
                  <Col md={24} sm={12} xs={12}>
                    {!(
                      canJoinCourse() ||
                      canJoinWaitingList() ||
                      canDisjoinCourse() ||
                      canDisjoinWaitingList()
                    ) ? (
                      <Tooltip title={getJoinBtnDisabledReason}>
                        {renderJoinButton()}
                      </Tooltip>
                    ) : (
                      renderJoinButton()
                    )}
                  </Col>
                  <Col md={24} sm={12} xs={12}>
                    <div className={classes.videochatAction}>
                      {((isMyCourse && course.state === CourseState.ALLOWED) ||
                        course.subcourse.joined) &&
                        !hasEnded() && (
                          <AntdButton
                            type="primary"
                            style={{
                              backgroundColor: '#FCD95C',
                              borderColor: '#FCD95C',
                              color: '#373E47',
                              width: '100%',
                            }}
                            onClick={joinBBBmeeting}
                            disabled={!shouldEnableVideoChat()}
                          >
                            Zum Videochat
                          </AntdButton>
                        )}
                      <ClipLoader
                        size={15}
                        color="#123abc"
                        loading={isLoadingVideoChat}
                      />
                    </div>
                  </Col>

                  <Col md={24} sm={12} xs={12}>
                    <div className={classes.videochatAction}>
                      {((isMyCourse && course.state === CourseState.ALLOWED) ||
                        course.subcourse.joined) &&
                        !hasEnded() && (
                          <Popover
                            className={classes.popover}
                            content={videoChatHint()}
                            trigger="hover"
                          >
                            <div style={{ width: '100%' }}>
                              <Button
                                disabled={!shouldEnableVideoChat()}
                                color="#373E47"
                                className={classnames(classes.courseButton, {
                                  [classes.disabled]: !shouldEnableVideoChat(),
                                })}
                                backgroundColor="#FCD95C"
                                onClick={joinTestMeeting}
                              >
                                Videochat testen
                              </Button>
                            </div>
                          </Popover>
                        )}
                    </div>
                  </Col>

                  {!isStudent && course.allowContact && (
                    <Col md={24} sm={12} xs={12}>
                      <div className={classes.contactInstructorsAction}>
                        <AntdButton
                          type="primary"
                          style={{
                            backgroundColor: '#FCD95C',
                            borderColor: '#FCD95C',
                            color: '#373E47',
                            width: '100%',
                          }}
                          onClick={openWriteMessageModal}
                          icon={<MailOutlined />}
                        >
                          Kontakt
                        </AntdButton>
                      </div>
                    </Col>
                  )}
                  <Col md={24} sm={12} xs={12}>
                    <div className={classes.shareAction}>
                      <Dropdown
                        overlay={antdShareMenu}
                        trigger={['click']}
                        visible={isCustomShareMenuVisible}
                        onVisibleChange={(v) =>
                          !v && setIsCustomShareMenuVisible(v)
                        }
                      >
                        <AntdButton
                          type="primary"
                          style={{
                            backgroundColor: '#FCD95C',
                            borderColor: '#FCD95C',
                            color: '#373E47',
                            width: '100%',
                          }}
                          onClick={shareCourse}
                          icon={<ShareAltOutlined />}
                        >
                          Kurs teilen
                        </AntdButton>
                      </Dropdown>
                    </div>
                  </Col>
                </Row>
              </div>
              {/* actionContainer end */}
            </Col>
          </Row>
        </div>
        <Row>
          <Col xxl={20} xl={22} lg={24}>
            <Row>
              <Col>
                <Descriptions
                  column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                  size="small"
                  style={{
                    margin: '10px',
                  }}
                  labelStyle={{ color: '#5a5a5a', fontWeight: 'bold' }}
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
                  <Descriptions.Item label="Teilnehmende">
                    {course.subcourse.participants}/
                    {course.subcourse.maxParticipants}
                  </Descriptions.Item>
                  <Descriptions.Item label="Klasse">
                    {course.subcourse.minGrade}-{course.subcourse.maxGrade}{' '}
                  </Descriptions.Item>
                  <Descriptions.Item label="Anzahl">
                    {course.subcourse.lectures.length} Lektionen
                  </Descriptions.Item>
                  <Descriptions.Item label="Dauer">
                    {course.subcourse.lectures
                      .map((l) => `${l.duration}min.`)
                      .join(', ')}{' '}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tutor*innen">
                    {instructors
                      .filter((item, pos) => instructors.indexOf(item) === pos)
                      .join(', ')}
                  </Descriptions.Item>
                  {isMyCourse && (
                    <Descriptions.Item label="Kontaktieren">
                      {course.allowContact ? 'erlaubt' : 'deaktiviert'}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Col>
            </Row>

            <Row>
              <Col>
                <Descriptions size="small" layout="vertical" column={1}>
                  <Descriptions.Item label="Beschreibung">
                    <div className={classes.descriptionWrapper}>
                      <p className={classes.description}>
                        {course.description}
                      </p>
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tags">
                    {course.tags.map((t) => {
                      return <Tag key={t.id}>{t.name}</Tag>;
                    })}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            {isMyCourse && (
              <div>
                <Title size="h3" style={{ margin: '10px 0px' }}>
                  Teilnehmer*innen
                </Title>

                <div>{renderParticipants()}</div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
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
              <div className={classes.newsContent}>
                <Row gutter={[14, 14]}>{renderLectures()}</Row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CourseMessageModal
        courseId={course.id}
        subcourseId={course.subcourse.id}
        type={
          isMyCourse ? 'instructorToParticipants' : 'participantToInstructors'
        }
      />
      <CourseDeletionConfirmationModal courseId={course.id} />
      <AddInstructorModal
        courseId={course.id}
        updateDetails={updateCourseDetails}
      />
      <AddCourseGuestModal courseId={course.id} />
      <CourseConfirmationModal
        mode={courseConfirmationMode}
        course={course}
        setCourse={setCourse}
      />
    </div>
  );
};

export default CourseDetail;
