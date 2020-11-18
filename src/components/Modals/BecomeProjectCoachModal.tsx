import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Form, message, Radio } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';

import classes from './BecomeProjectCoachModal.module.scss';
import { Title } from '../Typography';
import {
  BecomeProjectCoach,
  TutorJufoParticipationIndication,
} from '../../types/ProjectCoach';
import Button from '../button';
import { UserContext } from '../../context/UserContext';
import { dev } from '../../api/config';
import SelectProjectList from '../forms/SelectProjectField';
import { ProjectField } from '../../types';

const BecomeProjectCoachModal = () => {
  const [loading, setLoading] = useState(false);

  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const onFinish = (onFinish) => {
    if (onFinish.projectFields === 0) {
      return;
    }
    setLoading(true);

    const projectCoachData: BecomeProjectCoach = {
      wasJufoParticipant: onFinish.wasJufoParticipant,
      hasJufoCertificate: onFinish.hasJufoCertificate,
      projectFields: onFinish.projectFields,
    };

    api
      .postUserRoleProjectCoach(projectCoachData)
      .then(() => {
        message.success('Du wurdest als Projektcoach angemeldet.');
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
        <Title size="h2">Projektcoach werden</Title>
        <Form
          onFinish={onFinish}
          className={classes.formContainer}
          layout="vertical"
          name="basic"
          initialValues={{
            projectFields: [
              { name: ProjectField.ARBEITSWELT, min: 1, max: 13 },
            ],
          }}
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
            label="Wähle die Bereiche aus, in denen du Unterstützung anbieten Möchtest."
            name="projectFields"
            rules={[{ required: true }]}
          >
            <SelectProjectList />
          </Form.Item>
          <Form.Item>
            <div className={classes.buttonContainer}>
              <Button type="submit">Anmelden</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </StyledReactModal>
  );
};

export default BecomeProjectCoachModal;
