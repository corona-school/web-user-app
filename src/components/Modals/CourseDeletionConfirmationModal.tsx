import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import Images from '../../assets/images';
import { Title, Text } from '../Typography';
import Button from '../button';

import classes from './CourseDeletionConfirmationModal.module.scss';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';

interface Props {
  courseId: number;
}

const CourseDeletionConfirmationModal: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);

  const api = useContext(ApiContext);
  const modalContext = useContext(ModalContext);

  const history = useHistory();

  const sendMessage = () => {
    setLoading(true);

    api
      .cancelCourse(props.courseId)
      .then(() => {
        message.success('Kurs wurde abgesagt.');
        history.push('/courses');
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
        isOpen={modalContext.openedModal === 'courseDeletionConfirmationModal'}
      >
        <ClipLoader size={100} color="#123abc" loading />
      </StyledReactModal>
    );
  }

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'courseDeletionConfirmationModal'}
    >
      <div className={classes.messageModal}>
        <Images.StepsContact width="180" height="140" />
        <Title size="h2">Kurs absagen</Title>
        <Text style={{ marginTop: '-16px' }} large>
          Möchtest du den Kurs wirklich absagen?
        </Text>
        <Text>
          Sobald du deinen Kurs löschst werden alle Teilnehmer*innen deines
          Kurses per E-Mail informiert. Nach dem Löschvorgang hast du keine
          Möglichkeit Inhalte und/oder Teilnehmer*innen deines Kurses zu sehen.
          Falls du zu einem späteren Zeitpunkt wieder einen Kurs in der Corona
          School anbieten möchtest, kannst du jederzeit einen neuen Kurs
          erstellen.
        </Text>

        <div className={classes.buttonContainer}>
          <Button
            backgroundColor="#fa3d7f"
            color="white"
            onClick={sendMessage}
            className={classes.sendButton}
          >
            Absagen
          </Button>
          <Button
            backgroundColor="white"
            color="#363f46"
            className={classes.abort}
            onClick={() => {
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

export default CourseDeletionConfirmationModal;
