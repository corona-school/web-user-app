import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { Input, message } from 'antd';
import Images from '../../assets/images';
import { Title, Text } from '../Typography';
import Button from '../button';

import classes from './CourseMessageModal.module.scss';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';

interface Props {
  courseId: number;
  subcourseId: number;
  type: 'instructorToParticipants' | 'participantToInstructors';
}

const CourseMessageModal: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);

  const api = useContext(ApiContext);
  const modalContext = useContext(ModalContext);

  const apiMethod =
    props.type === 'instructorToParticipants'
      ? api.sendCourseGroupMail
      : api.sendCourseInstructorMail;

  const sendMessage = () => {
    if (!title || title.trim().length === 0) {
      message.error('Der Betreff der Nachricht fehlt.');
      return;
    }
    if (!text || text.trim().length === 0) {
      message.error('Der Text der Nachricht fehlt.');
      return;
    }

    setLoading(true);

    apiMethod(props.courseId, props.subcourseId, title, text)
      .then(() => {
        message.success('Nachricht wurde versendet.');
        setText(null);
        setTitle(null);
        modalContext.setOpenedModal(null);
      })
      .catch((err) => {
        message.error('Es ist ein Fehler aufgetreten.');
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <StyledReactModal
        isOpen={modalContext.openedModal === 'courseMessageModal'}
      >
        <ClipLoader size={100} color="#123abc" loading />
      </StyledReactModal>
    );
  }

  const renderExplanationText = () => {
    return (
      <Text style={{ marginTop: '-16px' }} large>
        {props.type === 'instructorToParticipants' && (
          <>Diese Nachricht wird an alle Teilnehmenden des Kurses verschickt.</>
        )}
        {props.type === 'participantToInstructors' && (
          <>
            Hier kannst du den Kursleiter:innen dieses Kurses eine Nachricht
            schreiben. Antworten auf deine Nachricht werden dir per E-Mail
            zugestellt.
          </>
        )}
      </Text>
    );
  };

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'courseMessageModal'}
    >
      <div className={classes.messageModal}>
        <Images.StepsContact width="180" height="140" />
        <Title size="h2">Nachricht schreiben</Title>
        {renderExplanationText()}
        <Text className={classes.label}>Betreff:</Text>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ margin: '8px 0px' }}
          placeholder="Betreff: Nachricht"
        />
        <Text className={classes.label}>Nachricht:</Text>
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoSize={{ minRows: 5, maxRows: 5 }}
          style={{ margin: '8px 0px' }}
          placeholder="Hier deine Nachricht"
        />
        <div className={classes.buttonContainer}>
          <Button
            backgroundColor="#fa3d7f"
            color="white"
            onClick={sendMessage}
            className={classes.sendButton}
          >
            Senden
          </Button>
          <Button
            backgroundColor="white"
            color="#363f46"
            className={classes.abort}
            onClick={() => {
              setText(null);
              setTitle(null);
              modalContext.setOpenedModal(null);
            }}
          >
            Abbrechen
          </Button>{' '}
        </div>
      </div>
    </StyledReactModal>
  );
};

export default CourseMessageModal;
