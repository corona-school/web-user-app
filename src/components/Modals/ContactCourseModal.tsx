import React, { useContext, useState } from 'react';
import { message as notif } from 'antd';
import { CourseParticipant, ParsedCourseOverview } from '../../types/Course';
import DialogModalBase from './DialogModalBase';
import Images from '../../assets/images';
import { ApiContext } from '../../context/ApiContext';
import { ModalContext } from '../../context/ModalContext';

interface Props {
  course: ParsedCourseOverview;
  selectedParticipants: CourseParticipant[];
  setSelectedParticipants: (selectedParticipants: CourseParticipant[]) => void;
  setSelectingParticipants: (isSelecting: boolean) => void;
  type: 'instructorToParticipants' | 'participantToInstructors';
}

const ContactCourseModal: React.FC<Props> = ({
  course,
  setSelectedParticipants,
  selectedParticipants,
  type,
  setSelectingParticipants,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const api = useContext(ApiContext);
  const modalContext = useContext(ModalContext);

  const apiMethod =
    type === 'instructorToParticipants'
      ? api.sendCourseGroupMail
      : api.sendCourseInstructorMail;

  const submit = () => {
    if (!subject || subject.trim().length === 0) {
      notif.error('Der Betreff der Nachricht fehlt.');
      return;
    }
    if (!message || message.trim().length === 0) {
      notif.error('Der Text der Nachricht fehlt.');
      return;
    }

    apiMethod(
      course.id,
      course.subcourse.id,
      subject,
      message,
      type === 'instructorToParticipants' && selectedParticipants
    )
      .then(() => {
        notif.success('Nachricht wurde versendet.');
        setMessage(null);
        setSubject(null);
        modalContext.setOpenedModal(null);
      })
      .catch((err) => {
        notif.error('Es ist ein Fehler aufgetreten.');
        console.log(err);
      });
  };

  const getDescription = () => {
    if (selectedParticipants.length === 0) {
      return 'Diese Nachricht wird an alle Teilnehmenden des Kurses verschickt.';
    }
    if (selectedParticipants.length === 1) {
      const { firstname, lastname } = selectedParticipants[0];
      return `Diese Nachricht wird an ${firstname} ${lastname} verschickt.`;
    }
    if (
      selectedParticipants.length === course.subcourse.participantList.length
    ) {
      return `Diese Nachricht wird an alle ${selectedParticipants.length} Teilnehmenden verschickt.`;
    }
    return `Diese Nachricht wird an die ausgewählten ${selectedParticipants.length} Teilnehmenden verschickt.`;
  };

  return (
    <DialogModalBase accentColor="#055202">
      <DialogModalBase.Modal modalName="contactCourseModal">
        <DialogModalBase.Header>
          <DialogModalBase.Title>
            Teilnehmer:innen kontaktieren
          </DialogModalBase.Title>
          <DialogModalBase.CloseButton
            hook={() => {
              setSelectedParticipants([]);
              setSelectingParticipants(false);
              setSubject('');
              setMessage('');
            }}
          />
        </DialogModalBase.Header>
        <DialogModalBase.Spacer />
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Images.StepsContact width="180" height="140" />
        </div>
        <DialogModalBase.Spacer />
        <DialogModalBase.Content>
          <DialogModalBase.Description>
            {getDescription()}
          </DialogModalBase.Description>
          <DialogModalBase.Form>
            <DialogModalBase.TextBox
              label="Betreff"
              onChange={(e) => setSubject(e.target.value)}
              value={subject}
            />
            <DialogModalBase.Spacer />
            <DialogModalBase.TextArea
              label="Nachricht"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </DialogModalBase.Form>
          <DialogModalBase.Spacer />
          <DialogModalBase.ButtonBox>
            <DialogModalBase.Button label="Senden" onClick={submit} />
          </DialogModalBase.ButtonBox>
        </DialogModalBase.Content>
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default ContactCourseModal;
