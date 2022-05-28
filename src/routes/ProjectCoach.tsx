import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'styled-components';
import { Empty } from 'antd';
import { Text, Title } from '../components/Typography';
import context from '../context';
import classes from './ProjectCoach.module.scss';
import { UserContext } from '../context/UserContext';
import { ProjectMatchCard } from '../components/cards/MatchCard';
import OpenRequestCard from '../components/cards/OpenRequestCard';
import { ScreeningStatus } from '../types';
import CancelMatchModal from '../components/Modals/CancelMatchModal';
import { ExpertRequestCard } from '../components/cards/ExpertRequestCard';
import { ApiContext } from '../context/ApiContext';
import { Expert } from '../types/Expert';
import { JufoExpertDetailCard } from '../components/cards/JufoExpertDetailCard';
import CardBase from '../components/base/CardBase';

const ProjectCoach: React.FC = () => {
  const { user } = useContext(context.User);
  const theme = useContext(ThemeContext);
  const modalContext = useContext(context.Modal);
  const userContext = useContext(UserContext);
  const apiContext = useContext(ApiContext);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [pinnedExperts, setPinnedExperts] = useState([]);

  const getPinnedExperts = () => {
    const stringExperts = window.localStorage.getItem('experts');
    if (!stringExperts) {
      return;
    }
    try {
      const experts = JSON.parse(stringExperts);
      if (experts instanceof Array) {
        setPinnedExperts(experts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPinnedExperts();
  }, [modalContext.openedModal]);

  useEffect(() => {
    if (
      !userContext.user.isProjectCoachee &&
      !userContext.user.isProjectCoach
    ) {
      return;
    }
    apiContext.getJufoExperts().then((experts) => {
      setExperts(experts);
    });
  }, [userContext.user]);

  const renderJufoExpertCards = () => {
    if (!user.isProjectCoachee) {
      return null;
    }
    const myExperts = experts.filter((e) => pinnedExperts.includes(e.id));
    return (
      <div className={classes.experts}>
        <Title size="h2">Deine Expert:innen</Title>
        <div className={classes.cardContainer}>
          {myExperts.map((e) => (
            <div className={classes.expertContainer}>
              <div className={classes.expertMatchBar} />
              <div className={classes.paddingContainer}>
                <JufoExpertDetailCard
                  expert={e}
                  type="card"
                  onUnpin={getPinnedExperts}
                />
              </div>
            </div>
          ))}
          <ExpertRequestCard
            onClick={() => modalContext.setOpenedModal('expertOverviewModal')}
          />
        </div>
      </div>
    );
  };

  const Matches = () => {
    const currentMatches = userContext.user.projectMatches
      .filter((match) => !match.dissolved)
      .map((match) => (
        <React.Fragment key={match.uuid}>
          <ProjectMatchCard
            match={match}
            type={userContext.user.type === 'student' ? 'coachee' : 'coach'}
            handleDissolveMatch={() => {
              modalContext.setOpenedModal(
                `cancelProjectMatchModal${match.uuid}`
              );
            }}
          />
          <CancelMatchModal
            identifier={`cancelProjectMatchModal${match.uuid}`}
            matchUuid={match.uuid}
            matchFirstname={match.firstname}
            ownType={userContext.user.type}
            projectCoaching
          />
        </React.Fragment>
      ));

    const dissolvedMatches = userContext.user.projectMatches
      .filter((match) => match.dissolved)
      .map((match) => (
        <React.Fragment key={match.uuid}>
          <ProjectMatchCard
            match={match}
            type={userContext.user.type === 'student' ? 'coachee' : 'coach'}
            handleDissolveMatch={() => {}}
          />
        </React.Fragment>
      ));

    return (
      <div className={classes.containerRequests}>
        {renderJufoExpertCards()}
        <Title size="h2">Deine Zuordnungen</Title>
        {currentMatches.length === 0 && (
          <Empty
            style={{ maxWidth: '1000px' }}
            description="Du hast keine aktiven Zuordnungen"
          />
        )}
        {currentMatches}
        {dissolvedMatches.length > 0 && (
          <Title size="h2">Entfernte Zuordnungen</Title>
        )}
        {dissolvedMatches}
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <Title size="h1">1:1-Projektcoaching</Title>
      <CardBase highlightColor="#4e6ae6">
        <div style={{ margin: '10px' }}>
          Das 1:1-Projektcoaching wird überarbeitet und in ein neues Angebot
          überführt. Daher ist keine weitere Anfrage für ein Matching mehr
          möglich. <br />
          Die Zusammenarbeit in deinem bisherigen Team ist davon nicht
          betroffen, ihr könnt sehr gerne gemeinsam weitertüfteln wie bisher.
          <br />
          {userContext.user.type !== 'student' ? (
            <>
              Erfahre <a href=" lern-fair.de/schueler/projektcoaching">hier</a>{' '}
              mehr zu den Fokuswochen von Lern-Fair Fokus, dem Nachfolger des
              1:1-Projektcoachings. Im Rahmen der Fokuswoche “MINT und
              Künstliche Intelligenz” vom 07. bis 11. November 2022 kannst du
              dich dort auch für die Unterstützung deines Projektes anmelden.
            </>
          ) : (
            <>
              Erfahre{' '}
              <a href="https://lern-fair.de/helfer/projektcoaching">hier</a>{' '}
              mehr zu den Fokuswochen von Lern-Fair Fokus, dem Nachfolger des
              1:1-Projektcoachings. Im Rahmen der Fokuswoche “MINT und
              Künstliche Intelligenz” vom 07. bis 11. November 2022 kannst du
              dort Schüler:innen bei ihrem Projekt unterstützen.
            </>
          )}
        </div>
      </CardBase>
      {((user.isProjectCoach &&
        user.projectCoachingScreeningStatus === ScreeningStatus.Accepted) ||
        user.isProjectCoachee) && <Matches />}
    </div>
  );
};

export default ProjectCoach;
