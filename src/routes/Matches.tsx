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

const STUDENT_MAX_REQUESTS = 3;
const PUPIL_MAX_REQUESTS = 1;
const PUPIL_MAX_MATCHES = 3;

function ConfirmationPending() {
  return (
    <Result
      className={classes.resultBox}
      status="info"
      title="Wir warten auf deine Bestätigung!"
      subTitle={
        <>
          <span>
            Dazu haben wir dir eine E-Mail geschickt. Schau einfach in dein
            E-Mail-Postfach und folge den Anweisungen in unserer E-Mail, um dein
            Interesse zu bestätigen. Sobald du dein Interesse bestätigt hast,
            werden wir dich schnellstmöglich mit einem/einer Student:in
            verbinden.
            <br />
            <br />
            Du hast diese E-Mail von uns nie erhalten? Bei Problemen kannst du
            dich an unser Team unter
          </span>{' '}
          <a href="mailto:support@lern-fair.de">support@lern-fair.de</a>
          <span> wenden.</span>
        </>
      }
    />
  );
}

function ConfirmationRefused() {
  return (
    <Result
      className={classes.resultBox}
      status="info"
      icon={<SmileOutlined />}
      title="Danke, dass du deinen Platz abgetreten hast!"
      subTitle={
        <>
          <span>
            In der Vergangenheit haben wir dir eine E-Mail geschickt und darin
            dein weiteres Interesse an diesem Angebot erfragt. Du hast uns
            damals mitgeteilt, dass du unser Angebot nicht mehr benötigst. Da
            aktuell der Andrang auf dieses kostenlose Angebot sehr groß ist,
            sind die Plätze begrenzt. Wir haben deinen Platz daher wieder
            freigegeben.
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

function LimitExceeded() {
  return (
    <Result
      className={classes.resultBox}
      status="info"
      icon={<SmileOutlined />}
      title="Maximale Anzahl an Machtes erreicht"
      subTitle={
        <>
          Du hast die maximale Anzahl an Matches erreicht, wir können dir leider
          keine:n weitere:n Lernpartner:in zuteilen. Es gibt sehr viele
          Schüler:innen, die auf unsere Unterstützung warten. Wende dich bitte
          an <a href="mailto:support@lern-fair.de">support@lern-fair.de</a>,
          wenn du weiterhin Unterstützung benötigst und/oder diesbezüglich
          Fragen hast
        </>
      }
    />
  );
}

const Matches: React.FC = () => {
  const { user } = useContext(UserContext);
  const modalContext = useContext(Context.Modal);

  function pupilOpenNewRequest() {
    if (user.pupilTutoringInterestConfirmationStatus === 'pending')
      return <ConfirmationPending />;

    if (user.pupilTutoringInterestConfirmationStatus === 'refused')
      return <ConfirmationRefused />;

    if (user.matchesRequested >= PUPIL_MAX_REQUESTS) return null;

    if (user.matches.length + user.matchesRequested >= PUPIL_MAX_MATCHES)
      return <LimitExceeded />;

    return (
      <OpenRequestCard
        type="new"
        userType={user.type}
        projectCoaching={false}
        disabled={user.isProjectCoachee && user.projectMatchesRequested > 0}
      />
    );
  }

  function studentOpenNewRequest() {
    return (
      <>
        {user.matchesRequested < STUDENT_MAX_REQUESTS && (
          <OpenRequestCard
            type="new"
            userType={user.type}
            projectCoaching={false}
            disabled={false}
          />
        )}
      </>
    );
  }

  const openNewRequest =
    user.type === 'pupil' ? pupilOpenNewRequest() : studentOpenNewRequest();

  const openRequests =
    user.matchesRequested === 0 ? (
      <Empty description="Du hast im Moment keine offenen Anfragen." />
    ) : (
      [...Array(user.matchesRequested).keys()].map(() => (
        <OpenRequestCard
          type="pending"
          userType={user.type}
          projectCoaching={false}
          disabled={false}
        />
      ))
    );

  const currentMatches = user.matches.map((match) => (
    <React.Fragment key={match.uuid}>
      <MatchCard
        type={user.type === 'student' ? 'pupil' : 'student'}
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
        ownType={user.type}
        projectCoaching={false}
      />
    </React.Fragment>
  ));

  const dissolvedMatches = user.dissolvedMatches.map((dissolvedMatch) => (
    <React.Fragment key={dissolvedMatch.uuid}>
      <MatchCard
        type={user.type === 'student' ? 'pupil' : 'student'}
        match={dissolvedMatch}
        handleDissolveMatch={() => {}}
        dissolved
      />
    </React.Fragment>
  ));
  return (
    <div className={classes.container}>
      <div className={classes.containerRequests}>
        <Title size="h1">Deine Anfragen</Title>
        <div className={classes.openRequests}>
          {openRequests}
          {openNewRequest}
        </div>
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
