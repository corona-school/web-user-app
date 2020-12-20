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
import { UserContext } from '../../context/UserContext';
import Images from '../../assets/images';

export const ContactJufoExpert: React.FC = () => {
  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const [loading, setLoading] = useState(false);
  const [expert, setExpert] = useState<Expert>(null);
  const [experts, setExperts] = useState<Expert[]>([]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const isOpen = modalContext.openedModal?.includes('contact-expert');

  const reloadExperts = () => {
    setLoading(true);
    api
      .getJufoExperts()
      .then((experts) => {
        setExperts(experts);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    reloadExperts();
  }, [userContext.user]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const modal = modalContext.openedModal;
    const id = modal.substring(modal.indexOf('#') + 1) || '';
    const e = experts.find((e) => `${e.id}` === id);
    if (e) {
      setExpert(e);
    }
  }, [isOpen]);

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
    return (
      <StyledReactModal
        isOpen={isOpen}
        onBackgroundClick={() => modalContext.setOpenedModal(null)}
      >
        <div className={classes.modal}>
          <div className={classes.title}>
            <Title size="h2">
              Nachricht an... {} {}
            </Title>
          </div>
          <div className={classes.buttonContainer}>
            <Images.NotFound />
            <Text large className={classes.text}>
              Experte konnte nicht gefunden werden.
            </Text>
            <Button
              backgroundColor="#4E6AE6"
              color="#ffffff"
              onClick={reloadExperts}
              className={classes.messageButton}
            >
              <ClipLoader size={40} color="#ffffff" loading={loading} />
              {loading ? '' : 'Erneut versuchen'}
            </Button>
          </div>
        </div>
      </StyledReactModal>
    );
  }

  return (
    <StyledReactModal
      isOpen={isOpen}
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
