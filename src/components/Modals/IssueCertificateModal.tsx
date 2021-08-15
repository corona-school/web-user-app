import React, { useContext } from 'react';
import { message } from 'antd';
import { CourseParticipant, ParsedCourseOverview } from '../../types/Course';
import Context from '../../context';
import { ModalContext } from '../../context/ModalContext';
import DialogModalBase from './DialogModalBase';
import AccentColorButton from '../button/AccentColorButton';
import { dev } from '../../api/config';

const IssueCertificateModal: React.FC<{
  course: ParsedCourseOverview;
  selectedParticipants: CourseParticipant[];
  resetSelect: () => void;
}> = ({ course, selectedParticipants, resetSelect }) => {
  const apiContext = useContext(Context.Api);
  const modalContext = useContext(ModalContext);

  const submit = () => {
    apiContext
      .issueCourseCertificates(
        course.id,
        course.subcourse.id,
        selectedParticipants.map((p) => p.uuid)
      )
      .then(() => {
        message.success(
          selectedParticipants.length > 1
            ? 'Die Kurszertifikate wurden versandt.'
            : 'Das Kurszertifikat wurde versandt.'
        );
        resetSelect();
      })
      .catch((err) => {
        if (dev) console.error(err);
        message.error('Es ist ein Fehler aufgetreten!');
      });

    modalContext.setOpenedModal('');
  };

  return (
    <DialogModalBase accentColor="1890FF">
      <DialogModalBase.Modal modalName="issueCertificateModal">
        <DialogModalBase.Header>
          <DialogModalBase.Title>
            Teilnahmezertifikate ausstellen
          </DialogModalBase.Title>
          <DialogModalBase.CloseButton />
        </DialogModalBase.Header>
        <DialogModalBase.Description>
          {selectedParticipants.length > 1
            ? 'Bist du dir sicher, diesen Teilnehmern Kurszertifikate auszustellen?'
            : 'Bist du dir sicher, diesem/dieser Teilnehmer*in ein Kurszertifikat auszustellen?'}
        </DialogModalBase.Description>
        <ul>
          {selectedParticipants.map((p) => (
            <li>
              {p.firstname} {p.lastname}
            </li>
          ))}
        </ul>
        <DialogModalBase.ButtonBox>
          <AccentColorButton
            accentColor="#055202"
            label="Ja, bestätigen"
            onClick={() => submit()}
          />
        </DialogModalBase.ButtonBox>
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default IssueCertificateModal;
