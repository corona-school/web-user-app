import React, { useContext, useState } from 'react';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import { Button as AntdButton } from 'antd';
import moment from 'moment';

import { AuthContext } from '../context/AuthContext';
import { Text } from '../components/Typography';
import 'moment/locale/de';
import classes from './PublicCourseDetail.module.scss';

import CourseDetail from './CourseDetail';

moment.locale('de');

const PublicCourseDetail = () => {
  const { id } = useParams();

  const history = useHistory();
  const auth = useContext(AuthContext);

  const [isWaitingList, setIsWaitingList] = useState(false);

  const privateCoursePage = `/courses/${id}`;

  if (auth.status === 'authorized') {
    return <Redirect to={privateCoursePage} />;
  }

  const joinCourse = () => {
    history.push(privateCoursePage);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        {/* header */}
        <div className={classes.headerText}>
          <h1 className={classes.headerTitle}>Interessanter Kurs?</h1>
          {isWaitingList && (
            <Text>
              Der Kurs ist bereits gefüllt – du kannst dich allerdings für die
              Warteliste eintragen und nachrücken, falls ein Platz frei wird.
              Erstelle dir dazu jetzt einen Account oder melde dich in deinem
              vorhanden Konto an!
            </Text>
          )}
          {!isWaitingList && (
            <Text>
              Erstelle dir jetzt einen Account oder melde dich in deinem
              vorhanden Konto an. Dann kannst du dich sofort für diesen{' '}
              <b>kostenlosen Kurs</b> anmelden! 🥳
            </Text>
          )}
        </div>
        <div className={classes.headerAction}>
          <AntdButton
            onClick={joinCourse}
            type="primary"
            style={{
              backgroundColor: '#FCD95C',
              borderColor: '#FCD95C',
              color: '#373E47',
              margin: '0px 10px',
            }}
          >
            Registrierung/Anmeldung
          </AntdButton>
        </div>
      </div>
      <div>
        {/* content */}
        <CourseDetail id={id} setIsWaitingList={setIsWaitingList} publicView />
      </div>
    </div>
  );
};

export default PublicCourseDetail;
