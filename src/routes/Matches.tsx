import React, { useContext } from 'react';
import PageComponent from '../components/PageComponent';
import Article from '../components/Article';
import OpenRequestCard from '../components/cardsOld/OpenRequestCard';
import { UserContext } from '../context/UserContext';
import Context from '../context';
import StudentExpandedCard from '../components/cardsOld/StudentExpandedCard';
import DissolveMatchModal from '../components/Modals/DissolveMatchModal';

const Matches: React.FC = () => {
  const userContext = useContext(UserContext);
  const modalContext = useContext(Context.Modal);

  const openRequests = (() => {
    if (userContext.user.type === 'pupil') {
      if (userContext.user.matches.length === 1) {
        return undefined;
      } else if (userContext.user.matchesRequested === 0) {
        return <OpenRequestCard type="new" />;
      } else if (userContext.user.matchesRequested === 1) {
        return <OpenRequestCard type="pending" />;
      }
    }

    switch (userContext.user.matchesRequested) {
      case 0:
        return <OpenRequestCard type="new" />;
      case 1:
        return (
          <>
            <OpenRequestCard type="pending" />
            <OpenRequestCard type="new" />
          </>
        );
      default:
        return (
          <>
            <OpenRequestCard type="pending" />
            <OpenRequestCard type="pending" />
          </>
        );
    }
  })();

  const currentMatches = userContext.user.matches.length
    ? userContext.user.matches.map((match) => (
        <React.Fragment key={match.uuid}>
          <StudentExpandedCard
            type={userContext.user.type === 'student' ? 'pupil' : 'student'}
            match={match}
            handleDissolveMatch={() => {
              modalContext.setOpenedModal('dissolveMatchModal' + match.uuid);
            }}
          />
          <DissolveMatchModal
            identifier={'dissolveMatchModal' + match.uuid}
            matchUuid={match.uuid}
            matchFirstname={match.firstname}
            ownType={userContext.user.type}
          />
        </React.Fragment>
      ))
    : undefined;

  return (
    <>
      {/* <Wrapper> */}
      <Article title="Deine Anfragen" cardDirection="row">
        {openRequests}
      </Article>
      <Article title="Deine Zuordnungen">{currentMatches}</Article>
      <Article title="Entfernte Zuordnungen"></Article>
      {/* </Wrapper> */}
    </>
  );
};

export default Matches;
