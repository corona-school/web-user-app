import React, { useContext } from 'react';
import { Title, Text } from '../components/Typography';
import classes from './Dashboard.module.scss';
import { Tag } from '../components/Tag';
import { getStatus, getNextSteps, getNews } from '../utils/DashboardUtils';
import { UserContext } from '../context/UserContext';
import { ColumnCard } from '../components/Card';

const Dashboard: React.FC = () => {
  const { user } = useContext(UserContext);

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
        <ColumnCard title={s.title} image={s.image} button={s.action}>
          {s.texts.map((text) => {
            return <Text>{text}</Text>;
          })}
        </ColumnCard>
      );
    });
  };

  const renderNews = () => {
    const news = getNews(user);

    return news.map((n) => {
      return (
        <div className={classes.newsContent}>
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
    </div>
  );
};

export default Dashboard;
