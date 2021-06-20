import React, { useContext } from 'react';
import { Empty, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import OpenRequestCard from '../components/cards/OpenRequestCard';
import { UserContext } from '../context/UserContext';
import Context from '../context';
import { Title } from '../components/Typography';
import classes from './Matches.module.scss';
import MatchCard from '../components/cards/MatchCard';
import CancelMatchModal from '../components/Modals/CancelMatchModal';

const Matches: React.FC = () => {
  const userContext = useContext(UserContext);
  const modalContext = useContext(Context.Modal);

  const openRequests = (() => {
    if (userContext.user.type === 'pupil') {
      if (userContext.user.matches.length === 1)
        return (
          <Empty description="Du hast im Moment keine offenen Anfragen." />
        );
      if (
        userContext.user.pupilTutoringInterestConfirmationStatus === 'pending'
      ) {
        return (
          <Result
            className={classes.resultBox}
            status="info"
            title="Wir warten auf deine Bestätigung!"
            subTitle={
              <>
                <span>
                  Dazu haben wir dir eine E-Mail geschickt. Schau einfach in
                  dein E-Mail-Postfach und folge den Anweisungen in unserer
                  E-Mail, um dein Interesse zu bestätigen. Sobald du dein
                  Interesse bestätigt hast, werden wir dich schnellstmöglich mit
                  einem/einer Student*in verbinden.
                  <br />
                  <br />
                  Du hast diese E-Mail von uns nie erhalten? Bei Problemen
                  kannst du dich an unser Team unter
                </span>{' '}
                <a href="mailto:support@lern-fair.de">support@lern-fair.de</a>
                <span> wenden.</span>
              </>
            }
          />
        );
      }
      if (
        userContext.user.pupilTutoringInterestConfirmationStatus === 'refused'
      ) {
        return (
          <Result
            className={classes.resultBox}
            status="info"
            icon={<SmileOutlined />}
            title="Danke, dass du deinen Platz abgetreten hast!"
            subTitle={
              <>
                <span>
                  In der Vergangenheit haben wir dir eine E-Mail geschickt und
                  darin dein weiteres Interesse an diesem Angebot erfragt. Du
                  hast uns damals mitgeteilt, dass du unser Angebot nicht mehr
                  benötigst. Da aktuell der Andrang auf dieses kostenlose
                  Angebot sehr groß ist, sind die Plätze begrenzt. Wir haben
                  deinen Platz daher wieder freigegeben.
                  <br />
                  Hier kannst du deshalb keine neue Hilfe anfordern.
                  <br /> <br />
                  Brauchst du nun wieder Hilfe? Wende dich dafür bitte an
                </span>{' '}
                <a href="mailto:support@lern-fair.de">support@lern-fair.de</a>
                <span>.</span>
              </>
            }
          />
        );
      }
      if (userContext.user.matchesRequested === 0) {
        return (
          <OpenRequestCard
            type="new"
            userType={userContext.user.type}
            projectCoaching={false}
            disabled={
              userContext.user.isProjectCoachee &&
              userContext.user.projectMatchesRequested > 0
            }
          />
        );
      }
      if (userContext.user.matchesRequested >= 1) {
        return (
          <>
            {[...Array(userContext.user.matchesRequested).keys()].map(() => (
              <OpenRequestCard
                type="pending"
                userType={userContext.user.type}
                projectCoaching={false}
                disabled={false}
              />
            ))}
          </>
        );
      }
    }

    if (userContext.user.matchesRequested === 0) {
      return (
        <OpenRequestCard
          type="new"
          userType={userContext.user.type}
          projectCoaching={false}
          disabled={false}
        />
      );
    }

    return (
      <>
        {[...Array(userContext.user.matchesRequested).keys()].map(() => (
          <OpenRequestCard
            type="pending"
            userType={userContext.user.type}
            projectCoaching={false}
            disabled={false}
          />
        ))}
        {userContext.user.matchesRequested < 3 && (
          <OpenRequestCard
            type="new"
            userType={userContext.user.type}
            projectCoaching={false}
            disabled={false}
          />
        )}
      </>
    );
  })();

  const currentMatches = userContext.user.matches.map((match) => (
    <React.Fragment key={match.uuid}>
      <MatchCard
        type={userContext.user.type === 'student' ? 'pupil' : 'student'}
        match={match}
        handleDissolveMatch={() => {
          modalContext.setOpenedModal(`cancelMatchModal${match.uuid}`);
        }}
        dissolved={false}
      />
      <CancelMatchModal
        identifier={`cancelMatchModal${match.uuid}`}
        matchUuid={match.uuid}
        matchFirstname={match.firstname}
        ownType={userContext.user.type}
        projectCoaching={false}
      />
    </React.Fragment>
  ));

  const dissolvedMatches = userContext.user.dissolvedMatches.map(
    (dissolvedMatch) => (
      <React.Fragment key={dissolvedMatch.uuid}>
        <MatchCard
          type={userContext.user.type === 'student' ? 'pupil' : 'student'}
          match={dissolvedMatch}
          handleDissolveMatch={() => {}}
          dissolved
        />
      </React.Fragment>
    )
  );
  return (
    <div className={classes.container}>
      <div className={classes.containerRequests}>
        <Title size="h1">Deine Anfragen</Title>
        <div className={classes.openRequests}>{openRequests}</div>
      </div>
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

export default Matches;
