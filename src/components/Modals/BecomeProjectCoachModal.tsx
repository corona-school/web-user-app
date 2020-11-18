import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Form, InputNumber, message, Radio, Select } from 'antd';
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
      projectFields: onFinish.projectFields.map((p) => ({
        name: p.name,
        min: p.minGrade,
        max: p.maxGrade,
      })),
    };

    console.log(projectCoachData);

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
          initialValues={{ projectFields: [''] }}
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
          <Form.List name="projectFields">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <>
                    <Form.Item
                      label="Bitte wähle einen Themenbereich aus."
                      name={[field.name, 'name']}
                      rules={[
                        {
                          required: true,
                          message:
                            'Bitte trage ein, in welchen Themenbereichen du unterstützen möchtest.',
                        },
                      ]}
                    >
                      <Select
                        placeholder="Bitte wähle einen Themenbereich aus."
                        options={Object.values(ProjectField).map((e) => ({
                          label: e,
                          value: e,
                        }))}
                      />
                    </Form.Item>
                    <div className={classes.gradeSelection}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message:
                              'Bitte trage ein, ab welcher Klassenstufe du Projektcoaching anbieten möchtest.',
                          },
                        ]}
                      >
                        <div
                          style={{ display: 'inline-block', margin: '0px 5px' }}
                        >
                          Klassenstufe
                        </div>
                        <Form.Item
                          name={[field.name, 'minGrade']}
                          style={{ display: 'inline-block', marginLeft: '4px' }}
                        >
                          <InputNumber min={1} max={13} />
                        </Form.Item>
                        <div
                          style={{ display: 'inline-block', margin: '0px 5px' }}
                        >
                          bis
                        </div>
                        <Form.Item
                          name={[field.name, 'maxGrade']}
                          style={{ display: 'inline-block' }}
                        >
                          <InputNumber min={1} max={13} />
                        </Form.Item>
                      </Form.Item>
                      {field.name !== 0 && (
                        <div className={classes.removeButtonContainer}>
                          <Button onClick={() => remove(field.name)}>
                            Entfernen
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                ))}
                <div className={classes.addButtonContainer}>
                  <Button onClick={() => add()}>
                    Weiteren Bereich auswählen
                  </Button>
                </div>
              </>
            )}
          </Form.List>
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
