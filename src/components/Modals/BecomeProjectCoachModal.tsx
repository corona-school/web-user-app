import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Form, message, Radio, Select } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';

import classes from './BecomeProjectCoachModal.module.scss';
import { Title } from '../Typography';
import {
  BecomeProjectCoach,
  ProjectField,
  TutorJufoParticipationIndication,
} from '../../types/ProjectCoach';
import Button from '../button';
import { UserContext } from '../../context/UserContext';
import { dev } from '../../api/config';

const BecomeProjectCoachModal = () => {
  const [loading, setLoading] = useState(false);

  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const onFinish = (onFinish) => {
    console.log('On finish');

    if (onFinish.projectFields === 0) {
      return;
    }
    setLoading(true);

    const projectCoachData: BecomeProjectCoach = {
      wasJufoParticipant: onFinish.wasJufoParticipant,
      hasJufoCertificate: onFinish.hasJufoCertificate,
      projectFields: onFinish.projectFields.map((p) => ({ name: p })),
    };

    console.log(projectCoachData);

    api
      .postUserRoleProjectCoach(projectCoachData)
      .then(() => {
        message.success('Du wurdest als Jugend-Forscht-Coach angemeldet.');
        modalContext.setOpenedModal(null);
        userContext.fetchUserData();
      })
      .catch((err) => {
        if (dev) console.error(err);
        message.error('Etwas ist schief gegangen.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <StyledReactModal
        isOpen={modalContext.openedModal === 'becomeProjectCoach'}
      >
        <div className={classes.modal}>
          <Title size="h2">Jugend-Forscht-Coach werden</Title>
          <ClipLoader size={100} color="#123abc" loading />
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
      isOpen={modalContext.openedModal === 'becomeProjectCoach'}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">Jugend-Forscht-Coach werden</Title>
        <Form
          onFinish={onFinish}
          className={classes.formContainer}
          layout="vertical"
          name="basic"
        >
          <Form.Item
            className={classes.formItem}
            label="Hast du in der Vergangenheit an Jugend Forscht teilgenommen?"
            name="wasJufoParticipant"
            rules={[
              {
                required: true,
                message:
                  'Bitte gebe, ob du an Jugend Forscht teilgenommen hast',
              },
            ]}
            initialValue={TutorJufoParticipationIndication.NO}
          >
            <Radio.Group>
              <Radio value={TutorJufoParticipationIndication.YES}>Ja</Radio>
              <Radio value={TutorJufoParticipationIndication.NO}>Nein</Radio>
              <Radio value={TutorJufoParticipationIndication.IDK}>
                Weiß nicht
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            className={classes.formItem}
            label="Hast du für deine Teilnahme an Jugend Forscht einen Nachweis?"
            name="hasJufoCertificate"
            rules={[
              {
                required: true,
                message:
                  'Bitte gebe an, ob du einen Nachweis für deine Teilnahme bei Jugend Forscht hast.',
              },
            ]}
            initialValue={false}
          >
            <Radio.Group>
              {/* eslint-disable-next-line react/jsx-boolean-value */}
              <Radio value={true}>Ja</Radio>
              <Radio value={false}>Nein</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            className={classes.formItem}
            label="In welchem Themenbereich möchtest du Unterstützung anbieten?"
            name="projectFields"
            rules={[
              {
                required: true,
                message:
                  'Bitte trage ein, in welchen Themenbereichen du unterstützen möchtest.',
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Bitte wähle deine Themenbereiche aus."
              options={Object.entries(ProjectField).map((e) => ({
                label: e[1],
                value: e[1],
              }))}
            />
          </Form.Item>
          <Form.Item>
            <div className={classes.buttonContainer}>
              <Button backgroundColor="#F4F6FF" color="#4E6AE6" type="submit">
                Anmelden
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </StyledReactModal>
  );
};

export default BecomeProjectCoachModal;
