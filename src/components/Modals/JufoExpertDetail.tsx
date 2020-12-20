import React, { useContext, useEffect, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { ClipLoader } from 'react-spinners';
import { Text, Title } from '../Typography';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';
import { Expert } from '../../types/Expert';
import Button from '../button';

import classes from './JufoExpertDetail.module.scss';
import { UserContext } from '../../context/UserContext';
import Images from '../../assets/images';
import { Tag } from '../Tag';
import Icons from '../../assets/icons';

export const JufoExpertDetail: React.FC = () => {
  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const [loading, setLoading] = useState(false);
  const [expert, setExpert] = useState<Expert>(null);
  const [experts, setExperts] = useState<Expert[]>([]);

  const isOpen = modalContext.openedModal?.includes('detail-expert');

  const [pinned, setPinned] = useState(false);

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
    if (userContext.user.isProjectCoachee || userContext.user.isProjectCoach) {
      reloadExperts();
    }
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

  useEffect(() => {
    if (!expert) {
      return;
    }
    try {
      const stringExperts = window.localStorage.getItem('experts');
      if (!stringExperts) {
        setPinned(false);
        return;
      }
      const experts = JSON.parse(stringExperts);
      if (experts instanceof Array && experts.includes(expert.id)) {
        setPinned(true);
      }

      // eslint-disable-next-line no-empty
    } catch (err) {}
  }, [expert]);

  const openEmailDialog = () => {
    modalContext.setOpenedModal(`contact-expert#${expert.id}`);
  };

  const pinExpert = () => {
    const stringExperts = window.localStorage.getItem('experts');
    if (!stringExperts) {
      window.localStorage.setItem('experts', JSON.stringify([expert.id]));
    }
    try {
      const experts = JSON.parse(stringExperts);
      if (experts instanceof Array && !experts.includes(expert.id)) {
        experts.push(expert.id);
        window.localStorage.setItem('experts', JSON.stringify(experts));
        setPinned(true);
      }

      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const unpinExpert = () => {
    const stringExperts = window.localStorage.getItem('experts');
    if (!stringExperts) {
      return;
    }
    try {
      const experts = JSON.parse(stringExperts);
      if (experts instanceof Array && experts.includes(expert.id)) {
        window.localStorage.setItem(
          'experts',
          JSON.stringify(experts.filter((e) => e !== expert.id))
        );
        setPinned(false);
      }

      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  if (!userContext.user.isProjectCoachee && !userContext.user.isProjectCoach) {
    return null;
  }

  if (!expert) {
    return (
      <StyledReactModal
        isOpen={isOpen}
        onBackgroundClick={() => modalContext.setOpenedModal(null)}
      >
        <div className={classes.modal}>
          <div className={classes.title}>
            <Title size="h2">Fehler</Title>
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
            {expert.firstName} {expert.lastName}
          </Title>
        </div>
        <div className={classes.wrapperContainer}>
          <div className={classes.leftSide}>
            <Text large className={classes.label}>
              Fachgebiet
            </Text>
            <div>
              {expert.projectFields.length === 0 ? (
                <Text large className={classes.value}>
                  Kein Fachgebiet
                </Text>
              ) : null}
              {expert.projectFields.map((field) => (
                <Tag
                  key={`${field}-${expert.id}`}
                  fontSize="12px"
                  background="#F4F6FF"
                  color="#4E6AE6"
                >
                  {field}
                </Tag>
              ))}
            </div>
          </div>
          <div className={classes.rightSide}>
            {userContext.user.isProjectCoachee && (
              <Button
                backgroundColor="#4E6AE6"
                color="#ffffff"
                className={classes.emailButton}
                image={
                  pinned ? (
                    <Icons.BookmarkSlashFilled />
                  ) : (
                    <Icons.BookmarkFilled />
                  )
                }
                onClick={pinned ? unpinExpert : pinExpert}
              />
            )}
            <Button
              backgroundColor="#4E6AE6"
              color="#ffffff"
              image={<Icons.EmailFilled />}
              onClick={openEmailDialog}
              className={classes.emailButton}
            />
          </div>
        </div>
        <Text large className={classes.label}>
          Beschreibung
        </Text>
        <Text large className={classes.value}>
          {expert.description}
        </Text>
        <Text large className={classes.label}>
          Experten-Tags
        </Text>
        <div className={classes.expertTags}>
          {expert.expertiseTags.map((tag) => (
            <Tag background="#4E555C" color="#ffffff">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </StyledReactModal>
  );
};
