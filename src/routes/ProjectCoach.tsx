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

const ProjectCoach: React.FC = () => {
  const { user } = useContext(context.User);
  const theme = useContext(ThemeContext);
  const modalContext = useContext(context.Modal);

  if (!user.isProjectCoach && user.isTutor) {
    return (
      <div className={classes.container}>
        <Title size="h1">Projektcoaching</Title>
        <LeftHighlightCard highlightColor={theme.color.cardHighlightYellow}>
          <Title size="h3">Lorem Ipsum</Title>
          <Text>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet.
          </Text>
          <Button
            className={classes.buttonParticipate}
            onClick={() => modalContext.setOpenedModal('becomeProjectCoach')}
          >
            Projektcoach werden
          </Button>
        </LeftHighlightCard>
        <BecomeProjectCoachModal />
      </div>
    );
  }

  if (!user.isProjectCoachee && user.isPupil) {
    return (
      <div className={classes.container}>
        <Title size="h1">Projektcoaching</Title>
        <LeftHighlightCard highlightColor={theme.color.cardHighlightYellow}>
          <Title size="h3">Lorem Ipsum</Title>
          <Text>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet.
          </Text>
          <Button
            className={classes.buttonParticipate}
            onClick={() => modalContext.setOpenedModal('becomeProjectCoachee')}
          >
            Unterstützung anfordern
          </Button>
        </LeftHighlightCard>
        <BecomeProjectCoacheeModal />
      </div>
    );
  }

  const Matches = () => {
    const userContext = useContext(UserContext);

    const openRequests = (() => {
      if (userContext.user.type === 'pupil') {
        if (userContext.user.projectMatches.length === 1) {
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
        if (userContext.user.matchesRequested >= 1) {
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
      <div>
        {openRequests}
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
      <Title size="h1">Projektcoaching</Title>
      <Matches />
    </div>
  );
};

export default ProjectCoach;
