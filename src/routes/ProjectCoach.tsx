import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Empty } from 'antd';
import Button from '../components/button';
import { Text, Title } from '../components/Typography';
import context from '../context';
import classes from './ProjectCoach.module.scss';
import { LeftHighlightCard } from '../components/cards/FlexibleHighlightCard';
import BecomeProjectCoachModal from '../components/Modals/BecomeProjectCoachModal';
import BecomeProjectCoacheeModal from '../components/Modals/BecomeProjectCoacheeModal';
import { UserContext } from '../context/UserContext';
import { ProjectMatchCard } from '../components/cards/MatchCard';
import OpenRequestCard from '../components/cards/OpenRequestCard';
import DissolveMatchModal from '../components/Modals/DissolveMatchModal';
import { ScreeningStatus } from '../types';

const ProjectCoach: React.FC = () => {
  const { user } = useContext(context.User);
  const theme = useContext(ThemeContext);
  const modalContext = useContext(context.Modal);

  const BecomeProjectCoach = () => {
    return (
      <LeftHighlightCard highlightColor={theme.color.cardHighlightYellow}>
        <Title size="h3">
          Schüler*innen bei außerschulischen Projekten unterstützen
        </Title>
        <Text>
          Immer noch ist der Schulalltag aufgrund der Corona-Pandemie stark
          eingeschränkt. Dabei fehlen den Schulen vor allem Kapazitäten zur
          Förderung zusätzlicher Projekte wie beispielsweise im Rahmen von
          Jugend forscht, dem bekanntesten Schüler- und Jugendwettbewerb im
          Bereich Naturwissenschaften und Technik. Daher wollen der Corona
          School e.V. gemeinsam mit der Stiftung Jugend Forscht e.V. nun auch
          Schüler*innen im Rahmen des 1:1-Projektcoachings bei Ihren Projekten
          mit Rat und Tat zur Seite stehen. Zusätzlich können Gruppenkurse
          angeboten und bei speziellen Fragen auf eine Expertendatenbank
          zurückgegriffen werden. Und genau dafür suchen wir dich! Wie bei der
          1:1-Lernunterstützung kannst du ein oder mehrere Projekte individuell
          begleiten und so durch dein Wissen Schüler*innen in ihrer Neugier Mehr
          Mehr Informationen findest du{' '}
          <a
            href="https://www.corona-school.de/1-zu-1-projektcoaching"
            style={{ color: '#0645AD' }}
          >
            hier
          </a>
          .
        </Text>
        <Button
          className={classes.buttonParticipate}
          onClick={() => modalContext.setOpenedModal('becomeProjectCoach')}
        >
          Jetzt 1:1-Projektcoach werden
        </Button>
      </LeftHighlightCard>
    );
  };

  const BecomeProjectCoachee = () => {
    return (
      <LeftHighlightCard highlightColor={theme.color.cardHighlightYellow}>
        <Title size="h3">Unterstützung bei Projekten bekommen</Title>
        <Text>
          Du hast eine Idee für ein Projekt oder interessierst dich für ein
          Thema? Bekomme auch bei diesen außerschulischen Projekten
          Unterstützung und melde dich für das 1:1-Projektcoaching an.
          funktioniert so: Nach Auswahl des Fachbereichs teilen wir dir eine
          Expert*in zu, die dich in Ideenfindung, Umsetzung, Präsentation und
          mehr unterstützt. Profitiere von der Erfahrung der älteren Coach*in
          und bringe dein Projekt noch weiter nach vorne! Mehr Informationen
          findest du{' '}
          <a
            href="https://www.corona-school.de/1-zu-1-projektcoaching"
            style={{ color: '#0645AD' }}
          >
            hier
          </a>
          . Übrigens: Das 1:1-Projektcoaching entstand aus einer Kooperation mit
          der Stiftung Jugend forscht, der übrigens auch den Wettbewerb{' '}
          <a href="https://www.jugend-forscht.de/" style={{ color: '#0645AD' }}>
            {' '}
            Jugend forscht
          </a>{' '}
          veranstaltet, bei dem du, wenn du möchtest, dein Projekt auch kannst.
        </Text>
        <Button
          className={classes.buttonParticipate}
          onClick={() => modalContext.setOpenedModal('becomeProjectCoachee')}
        >
          Jetzt anmelden
        </Button>
      </LeftHighlightCard>
    );
  };

  const Matches = () => {
    const userContext = useContext(UserContext);

    const openRequests = (() => {
      if (userContext.user.type === 'pupil') {
        if (
          userContext.user.projectMatches.filter((match) => !match.dissolved)
            .length === 1
        ) {
          return (
            <Empty description="Du hast im Moment keine offenen Anfragen." />
          );
        }
        if (userContext.user.projectMatchesRequested === 0) {
          return (
            <OpenRequestCard
              type="new"
              userType={userContext.user.type}
              projectCoaching
            />
          );
        }
        if (userContext.user.projectMatchesRequested >= 1) {
          return (
            <>
              {[...Array(userContext.user.projectMatchesRequested).keys()].map(
                () => (
                  <OpenRequestCard
                    type="pending"
                    userType={userContext.user.type}
                    projectCoaching
                  />
                )
              )}
            </>
          );
        }
      }

      if (userContext.user.matchesRequested === 0) {
        return (
          <OpenRequestCard
            type="new"
            userType={userContext.user.type}
            projectCoaching
          />
        );
      }

      return (
        <>
          {[...Array(userContext.user.projectMatchesRequested).keys()].map(
            () => (
              <OpenRequestCard
                type="pending"
                userType={userContext.user.type}
                projectCoaching
              />
            )
          )}
          <OpenRequestCard
            type="new"
            userType={userContext.user.type}
            projectCoaching
          />
        </>
      );
    })();

    const currentMatches = userContext.user.projectMatches
      .filter((match) => !match.dissolved)
      .map((match) => (
        <React.Fragment key={match.uuid}>
          <ProjectMatchCard
            match={match}
            type={userContext.user.type === 'student' ? 'coachee' : 'coach'}
            handleDissolveMatch={() => {
              modalContext.setOpenedModal(
                `dissolveProjectMatchModal${match.uuid}`
              );
            }}
          />
          <DissolveMatchModal
            identifier={`dissolveProjectMatchModal${match.uuid}`}
            matchFirstname={match.firstname}
            matchUuid={match.uuid}
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
        <div className={classes.openRequests}>{openRequests}</div>
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
      {!user.isProjectCoach && user.isTutor && <BecomeProjectCoach />}
      {!user.isProjectCoachee && user.isPupil && <BecomeProjectCoachee />}
      {((user.isProjectCoach &&
        user.projectCoachingScreeningStatus === ScreeningStatus.Accepted) ||
        user.isProjectCoachee) && <Matches />}
      <BecomeProjectCoachModal />
      <BecomeProjectCoacheeModal />
    </div>
  );
};

export default ProjectCoach;
