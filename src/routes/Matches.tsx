import React, { useContext } from 'react';
import { Empty } from 'antd';
import OpenRequestCard from '../components/cards/OpenRequestCard';
import { UserContext } from '../context/UserContext';
import Context from '../context';
import DissolveMatchModal from '../components/Modals/DissolveMatchModal';
import { Title } from '../components/Typography';
import classes from './Matches.module.scss';
import MatchCard from '../components/cards/MatchCard';

const Matches: React.FC = () => {
  const userContext = useContext(UserContext);
  const modalContext = useContext(Context.Modal);

  const openRequests = (() => {
    if (userContext.user.type === 'pupil') {
      if (userContext.user.matches.length === 1)
        return (
          <Empty description="Du hast im moment keine offenen Anfragen." />
        );
      if (userContext.user.matchesRequested === 0) {
        return <OpenRequestCard type="new" userType={userContext.user.type} />;
      }
      if (userContext.user.matchesRequested >= 1) {
        return (
          <>
            {[...Array(userContext.user.matchesRequested).keys()].map(() => (
              <OpenRequestCard
                type="pending"
                userType={userContext.user.type}
              />
            ))}
          </>
        );
      }
    }

    if (userContext.user.matchesRequested === 0) {
      return <OpenRequestCard type="new" userType={userContext.user.type} />;
    }

    return (
      <>
        {[...Array(userContext.user.matchesRequested).keys()].map(() => (
          <OpenRequestCard type="pending" userType={userContext.user.type} />
        ))}
        <OpenRequestCard type="new" userType={userContext.user.type} />
      </>
    );
  })();

  const currentMatches = userContext.user.matches.map((match) => (
    <React.Fragment key={match.uuid}>
      <MatchCard
        type={userContext.user.type === 'student' ? 'pupil' : 'student'}
        match={match}
        handleDissolveMatch={() => {
          modalContext.setOpenedModal(`dissolveMatchModal${match.uuid}`);
        }}
        dissolved={false}
      />
      <DissolveMatchModal
        identifier={`dissolveMatchModal${match.uuid}`}
        matchUuid={match.uuid}
        matchFirstname={match.firstname}
        ownType={userContext.user.type}
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
      {currentMatches}
      <Title size="h2">Entfernte Zuordnungen</Title>
      {dissolvedMatches}
    </div>
  );
};

export default Matches;
