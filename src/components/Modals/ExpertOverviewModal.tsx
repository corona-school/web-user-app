import React, { useContext, useEffect, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { ClipLoader } from 'react-spinners';
import { Empty } from 'antd';

import { Title } from '../Typography';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';
import classes from './ExpertOverviewModal.module.scss';
import { Expert } from '../../types/Expert';
import { JufoExpertDetailCard } from '../cards/JufoExpertDetailCard';
import { UserContext } from '../../context/UserContext';
import { ExpertSearch } from '../search/ExpertSearch';

export const MODAL_IDENTIFIER = 'expertOverviewModal';
const MODAL_TITLE = 'Liste von Expert*innen';

export const ExpertOverviewModal: React.FC = () => {
  const userContext = useContext(UserContext);
  const modalContext = useContext(ModalContext);
  const api = useContext(ApiContext);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !userContext.user.isProjectCoachee &&
      !userContext.user.isProjectCoach
    ) {
      return;
    }
    if (modalContext.openedModal === MODAL_IDENTIFIER) {
      setLoading(true);
      api
        .getJufoExperts()
        .then((result) => {
          setExperts(result);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [modalContext.openedModal, userContext.user]);

  if (!userContext.user.isProjectCoachee && !userContext.user.isProjectCoach) {
    return null;
  }

  if (loading) {
    return (
      <StyledReactModal isOpen={modalContext.openedModal === MODAL_IDENTIFIER}>
        <div className={classes.modal}>
          <Title size="h2">Wir aktualisieren deine Informationen...</Title>
          <ClipLoader size={100} color="#4E6AE6" loading />
        </div>
      </StyledReactModal>
    );
  }

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === MODAL_IDENTIFIER}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">{MODAL_TITLE}</Title>
        <div className={classes.expertSearch}>
          <ExpertSearch placeHolder="Suche nach Expert*innen für.." />
        </div>
        {experts.length !== 0 ? (
          experts.map((expert) => (
            <JufoExpertDetailCard key={expert.id} expert={expert} />
          ))
        ) : (
          <Empty
            description="
          keine Ergebnisse gefunden"
            style={{ padding: '2rem' }}
          />
        )}
      </div>
    </StyledReactModal>
  );
};
