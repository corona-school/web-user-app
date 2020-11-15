import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Form, message, Radio, Select, Slider } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';

import classes from './BecomeProjectCoacheeModal.module.scss';
import { Title } from '../Typography';
import {
  BecomeProjectCoachee,
  TuteeJufoParticipationIndication,
} from '../../types/ProjectCoach';
import Button from '../button';
import { UserContext } from '../../context/UserContext';
import { dev } from '../../api/config';
import { ProjectField } from '../../types';

const BecomeProjectCoacheeModal = () => {
  const [loading, setLoading] = useState(false);
  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const onFinish = (onFinish) => {
    if (onFinish.projectFields === 0) {
      return;
    }
    setLoading(true);

    const projectCoacheeData: BecomeProjectCoachee = {
      projectFields: onFinish.projectFields,
      isJufoParticipant: onFinish.isJufoParticipant,
      projectMemberCount: onFinish.projectMemberCount,
    };

    console.log(projectCoacheeData);

    api
      .postUserRoleProjectCoachee(projectCoacheeData)
      .then(() => {
        message.success('Ein Projektcoach wurde für dich angefordert.');
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
          <Title size="h2">Projektcoach werden</Title>
          <ClipLoader size={100} color="#123abc" loading />
          <div className={classes.buttonContainer}>
            <Button backgroundColor="#F4F6FF" color="#4E6AE6">
              Anfordern
            </Button>
          </div>
        </div>
      </StyledReactModal>
    );
  }

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'becomeProjectCoachee'}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">Projektcoach anfordern</Title>
        <Form
          onFinish={onFinish}
          className={classes.formContainer}
          layout="vertical"
          name="basic"
        >
          <Form.Item
            className={classes.formItem}
            label="In welchen Themenbereichen suchst du Unterstützung?"
            name="projectFields"
            rules={[
              {
                required: true,
                message: 'Bitte gebe mindestens einen Themenbereich an.',
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Bitte wähle einen Themenbereich aus."
              options={Object.values(ProjectField).map((e) => ({
                label: e,
                value: e,
              }))}
            />
          </Form.Item>
          <Form.Item
            className={classes.formItem}
            label="Wieviele Teinehmer hat dein Projekt?"
            name="projectMemberCount"
            rules={[
              {
                required: true,
                message: 'Bitte gebe an, wieviele Teilnehmer dein Projekt hat.',
              },
            ]}
          >
            <Slider min={1} max={3} tooltipVisible />
          </Form.Item>
          <Form.Item
            className={classes.formItem}
            label="Nimmst du an Jugend forscht teil?"
            name="isJufoParticipant"
            rules={[
              {
                required: true,
                message: 'Bitte gebe an, ob du an Jugend forsch teilnimmst',
              },
            ]}
          >
            <Radio.Group>
              <Radio value={TuteeJufoParticipationIndication.YES}>Ja</Radio>
              <Radio value={TuteeJufoParticipationIndication.NO}>Nein</Radio>
              <Radio value={TuteeJufoParticipationIndication.UNSURE}>
                Ich bin mir unsicher.
              </Radio>
              <Radio value={TuteeJufoParticipationIndication.NEVERHEARD}>
                Ich habe noch nie von Jugend forsch gehört.
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <div className={classes.buttonContainer}>
              <Button backgroundColor="#F4F6FF" color="#4E6AE6" type="submit">
                Anfordern
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </StyledReactModal>
  );
};

export default BecomeProjectCoacheeModal;
