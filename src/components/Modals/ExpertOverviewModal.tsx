import React, { useContext, useEffect, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { ClipLoader } from 'react-spinners';
import { Title } from '../Typography';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';

import classes from './ExpertOverviewModal.module.scss';
import { Expert } from '../../types/Expert';

export const MODAL_IDENTIFIER = 'expertOverviewModal';
const MODAL_TITLE = 'Experten*innen';

export const ExpertOverviewModal: React.FC = () => {
  const modalContext = useContext(ModalContext);
  const api = useContext(ApiContext);

  const [experts, setExpertts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalContext.openedModal === MODAL_IDENTIFIER) {
      setLoading(true);
      api
        .getJufoExperts()
        .then((result) => {
          setExpertts(result);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [modalContext.openedModal]);

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
        <div>
          {experts.map((expert) => (
            <div key={`${expert.id}`}>
              {expert.firstName} {expert.lastName}
            </div>
          ))}
        </div>
      </div>
    </StyledReactModal>
  );
};
