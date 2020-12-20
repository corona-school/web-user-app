import React, { useContext, useEffect, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { ClipLoader } from 'react-spinners';
import Search from 'antd/lib/input/Search';
import { Title } from '../Typography';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';

import classes from './ExpertOverviewModal.module.scss';
import { Expert } from '../../types/Expert';
import { JufoExpertDetailCard } from '../cards/JufoExpertDetailCard';
import { UserContext } from '../../context/UserContext';

export const MODAL_IDENTIFIER = 'expertOverviewModal';
const MODAL_TITLE = 'Liste von Experten*innen';

export const ExpertOverviewModal: React.FC = () => {
  const userContext = useContext(UserContext);
  const modalContext = useContext(ModalContext);
  const api = useContext(ApiContext);

  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFileredExperts] = useState<Expert[]>([]);
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
          setFileredExperts(result);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [modalContext.openedModal, userContext.user]);

  const onSearch = (value: string) => {
    if (value.trim().length === 0) {
      setFileredExperts(experts);
      return;
    }
    const searchString = value.toLowerCase();
    const filter = experts.filter(
      (e) =>
        e.description.toLowerCase().includes(searchString) ||
        e.expertiseTags.some((t) => t.toLowerCase().includes(searchString)) ||
        e.projectFields.some((p) => p.toLowerCase().includes(searchString)) ||
        e.firstName.toLowerCase().includes(searchString) ||
        e.lastName.toLowerCase().includes(searchString)
    );
    setFileredExperts(filter);
  };

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
        <Search
          placeholder="Suche nach Experten für.."
          allowClear
          onSearch={onSearch}
          className={classes.search}
        />

        {filteredExperts.map((expert) => (
          <JufoExpertDetailCard key={expert.id} expert={expert} />
        ))}
      </div>
    </StyledReactModal>
  );
};
