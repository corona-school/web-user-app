import React, { useContext, useEffect, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { ClipLoader } from 'react-spinners';
import { Input, message } from 'antd';
import { Text, Title } from '../Typography';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';
import { Expert } from '../../types/Expert';
import Button from '../button';

import classes from './ContactJufoExpert.module.scss';

export const ContactJufoExpert: React.FC = () => {
  const modalContext = useContext(ModalContext);
  const api = useContext(ApiContext);

  const [loading, setLoading] = useState(false);
  const [expert, setExpert] = useState<Expert>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (modalContext.openedModal === null || loading) {
      return;
    }
    setLoading(true);

    api
      .getJufoExperts()
      .then((experts) => {
        const e = experts.find((e) => e.id === modalContext.openedModal);
        if (e) {
          setExpert(e);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [modalContext.openedModal]);

  const contactExpert = () => {
    if (loading) {
      return;
    }
    if (title.trim().length === 0 || body.trim().length === 0) {
      return;
    }
    setLoading(true);
    api
      .contactJufoExpert(expert.id, title, body)
      .then(() => {
        message.success('Nachricht wurde versendet.');
        modalContext.setOpenedModal(null);
      })
      .catch(() => {
        message.error('Ein Feler ist aufegetreten.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!expert) {
    return null;
  }

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === expert.id}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <div className={classes.title}>
          <Title size="h2">
            Nachricht an {expert.firstName} {expert.lastName}
          </Title>
        </div>
        <Text className={classes.text}>Betreff</Text>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Hier dein Betreff"
        />
        <Text className={classes.text}>Nachricht</Text>
        <Input.TextArea
          value={body}
          autoSize={{ minRows: 5, maxRows: 10 }}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Hier deine Nachricht an den Experten"
        />
        <div className={classes.buttonContainer}>
          <Button
            backgroundColor="#4E6AE6"
            color="#ffffff"
            onClick={contactExpert}
            className={classes.messageButton}
          >
            <ClipLoader size={40} color="#ffffff" loading={loading} />
            {loading ? '' : 'Nachricht senden'}
          </Button>
        </div>
      </div>
    </StyledReactModal>
  );
};
