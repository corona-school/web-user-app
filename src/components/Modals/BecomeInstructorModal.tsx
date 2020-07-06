import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { Title, Text } from '../Typography';
import Button from '../button';
import { ModalContext } from '../../context/ModalContext';

import classes from './BecomeInstructorModal.module.scss';
import { User } from '../../types';
import { Input, message } from 'antd';
import { ApiContext } from '../../context/ApiContext';

interface Props {
  user: User;
}

const BecomeInstructorModal: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(null);

  const modalContext = useContext(ModalContext);
  const api = useContext(ApiContext);

  const becomeInstructor = () => {
    setLoading(true);

    api
      .becomeInstructor(description)
      .then(() => {
        message.success('Du wurdest als Kursleiter*in angemeldet.');
        modalContext.setOpenedModal(null);
      })
      .catch((err) => {
        message.error('Etwas ist schief gegangen.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <StyledReactModal
        isOpen={modalContext.openedModal === 'becomeInstructor'}
      >
        <div className={classes.modal}>
          <Title size="h2">Kursleiter*in werden</Title>
          <ClipLoader size={100} color={'#123abc'} loading={true} />
          <div className={classes.buttonContainer}>
            <Button backgroundColor="#F4F6FF" color="#4E6AE6">
              Anmelden
            </Button>
          </div>
        </div>
      </StyledReactModal>
    );
  }

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'becomeInstructor'}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">Kursleiter*in werden</Title>
        <Text large>
          Beschreibe die Inhalte deines Gruppenkurses (3-5 Sätze)
        </Text>
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoSize={{ minRows: 6 }}
          placeholder={'Kursthema, Zielgruppe, Kursgröße, Interaktion'}
        />
        <div className={classes.buttonContainer}>
          <Button
            backgroundColor="#F4F6FF"
            color="#4E6AE6"
            onClick={becomeInstructor}
          >
            Anmelden
          </Button>
        </div>
      </div>
    </StyledReactModal>
  );
};

export default BecomeInstructorModal;
