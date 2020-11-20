import React, { useContext, useEffect } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { Title, Text } from '../components/Typography';
import classes from './Dashboard.module.scss';
import { Tag } from '../components/Tag';
import { getStatus, getNextSteps, getNews } from '../utils/DashboardUtils';
import { UserContext } from '../context/UserContext';
import { ColumnCard } from '../components/Card';
import UpdateInformationBlockerModal, {
  MODAL_IDENTIFIER as UpdateInformationBlockerModalIdentifier,
} from '../components/Modals/UpdateInformationBlockerModal';
import Context from '../context';
import { nextDateOfYearAfterDate } from '../utils/DateUtils';
import { isProjectCoacheeButNotPupil } from '../utils/UserUtils';

const Dashboard: React.FC = () => {
  const { setOpenedModal } = useContext(Context.Modal);
  const { user } = useContext(UserContext);
  const history = useHistory();

  if (user.type === 'student' && !user.isTutor) {
    history.push('/');
  }

  if (isProjectCoacheeButNotPupil(user)) {
    history.push('/');
  }

  useEffect(() => {
    const shouldShowUpdateInformationBlocker =
      (!user.lastUpdatedSettingsViaBlocker &&
        moment().isAfter(
          nextDateOfYearAfterDate(1, 8, moment.unix(user.registrationDate))
        )) ||
      (user.lastUpdatedSettingsViaBlocker &&
        moment().isAfter(
          // always show blocker on 09-01 in following year after settings were last updated via the blocker
          nextDateOfYearAfterDate(
            1,
            8,
            moment.unix(user.lastUpdatedSettingsViaBlocker)
          )
        ));

    if (shouldShowUpdateInformationBlocker) {
      setOpenedModal(UpdateInformationBlockerModalIdentifier);
    } else {
      setOpenedModal(null);
    }
  }, [
    setOpenedModal,
    user.lastUpdatedSettingsViaBlocker,
    user.registrationDate,
  ]);

  const renderStatusText = () => {
    const status = getStatus(user);

    if (!status) {
      return (
        <div className={classes.statusContainer}>
          <Title size="h1">Dein aktueller Status</Title>
          <Title size="h4">Etwas ist schief gelaufen</Title>
          <div className={classes.content}>
            <Text large className={classes.text}>
              Leider können wir Dir dein Status nicht laden. Komme später vorbei
              oder schreibe uns eine E-Mail.
            </Text>
          </div>
        </div>
      );
    }

    return (
      <div className={classes.statusContainer}>
        <Title size="h1">
          Dein aktueller <span className={classes.statusText}>Status</span>
        </Title>
        <Title size="h4">{status?.title}</Title>
        <div className={classes.content}>
          <Text large className={classes.text}>
            {status?.description}
          </Text>
        </div>
      </div>
    );
  };

  const renderNextSteps = () => {
    const steps = getNextSteps(user);
    console.log(steps);

    if (!steps) {
      return <div>bla</div>;
    }

    return steps.map((s) => {
      return (
        <ColumnCard
          key={s.title}
          title={s.title}
          image={s.image}
          button={s.action}
        >
          {s.texts.map((text) => {
            return <Text key={text}>{text}</Text>;
          })}
        </ColumnCard>
      );
    });
  };

  const renderNews = () => {
    const news = getNews(user);

    return news.map((n) => {
      return (
        <div className={classes.newsContent} key={n.headline + n.text}>
          <div className={classes.newsHeadline}>
            <Tag>NEU</Tag>
            <Title bold size="h5">
              {n.headline}
            </Title>
          </div>
          <Text>{n.text}</Text>
        </div>
      );
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.topGrid}>
        {renderStatusText()}

        <div className={classes.newsContainer}>
          <Title size="h3" bold>
            Neuigkeiten
          </Title>
          <div className={classes.newsContentContainer}>{renderNews()}</div>
        </div>
      </div>
      <div className={classes.bottomContainer}>
        <Title size="h3">
          Deine nächsten <b>Schritte</b>
        </Title>
        <div className={classes.bottomGrid}>{renderNextSteps()}</div>
      </div>
      <UpdateInformationBlockerModal user={user} />
    </div>
  );
};

export default Dashboard;
