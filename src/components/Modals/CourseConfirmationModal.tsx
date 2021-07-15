import React, { useContext, useState } from 'react';
import { message } from 'antd';
import DialogModalBase from './DialogModalBase';
import Context from '../../context';
import { ModalContext } from '../../context/ModalContext';
import { ParsedCourseOverview } from '../../types/Course';
import { AuthContext } from '../../context/AuthContext';
import { ReactComponent as EnrollIcon } from '../../assets/icons/sign-in-alt-solid.svg';
import { ReactComponent as VideoIcon } from '../../assets/icons/video-solid.svg';
import { apiURL } from '../../api/config';

const accentColorJoin = '#009d41';
const accentColorQuit = '#ba0707';

/*
Used for confirming if a user actually wants to quit / join a course or not
 */
const CourseConfirmationModal: React.FC<{
  mode: 'quit' | 'join';
  course: ParsedCourseOverview | null;
  setCourse: (any) => void;
}> = ({ mode, course, setCourse }) => {
  const apiContext = useContext(Context.Api);
  const auth = useContext(AuthContext);
  const userId = auth.credentials.id;
  const modalContext = useContext(ModalContext);
  const [pageIndex, setPageIndex] = useState<0 | 1>(0);

  const submit = () => {
    if (mode === 'quit') {
      apiContext
        .leaveCourse(course.id, course.subcourse.id, userId)
        .then(() => {
          setCourse({
            ...course,
            subcourse: {
              ...course.subcourse,
              participants: course.subcourse.participants - 1,
              joined: false,
            },
          });
          message.success('Du hast den Kurs entfernt.');
          modalContext.setOpenedModal(null);
        });
    } else {
      if (pageIndex === 1) {
        const newWindow = window.open(
          `${apiURL}/course/test/meeting/join?Token=${auth.credentials.token}`,
          '_blank',
          'noopener,noreferrer'
        );
        if (newWindow) newWindow.opener = null;
        modalContext.setOpenedModal(null);
        return;
      }
      apiContext
        .joinCourse(course.id, course.subcourse.id, userId)
        .then(() => {
          setCourse({
            ...course,
            subcourse: {
              ...course.subcourse,
              participants: course.subcourse.participants + 1,
              joined: true,
              onWaitingList: false,
            },
          });
          message.success('Du bist dem Kurs beigetreten.');
          setPageIndex(1);
        })
        .catch((e) => {
          if (e?.request.status === 429) {
            message.error(
              'Teilnahme nicht möglich! Du kannst nur an maximal zehn aktiven Kursen teilnehmen!'
            );
          } else {
            message.error('Es ist ein Fehler aufgetreten');
          }
        });
    }
  };

  return (
    <DialogModalBase
      accentColor={mode === 'quit' ? accentColorQuit : accentColorJoin}
    >
      <DialogModalBase.Modal modalName="courseConfirmationModal">
        {(mode === 'quit' || (mode === 'join' && pageIndex === 0)) && (
          <div>
            <DialogModalBase.Header>
              <DialogModalBase.Icon Icon={EnrollIcon} />
              <DialogModalBase.Title>
                {mode === 'quit' ? 'Kurs entfernen' : 'Verbindliche Anmeldung'}
              </DialogModalBase.Title>
              <DialogModalBase.CloseButton />
            </DialogModalBase.Header>
            <div>
              <DialogModalBase.Description>
                {mode === 'quit'
                  ? 'Bist du dir sicher, dass du den Kurs entfernen möchtest?'
                  : 'Wenn du dich für diesen Kurs anmeldest, werden wir einen Platz für dich reservieren. Bist du sicher, dass du teilnehmen möchtest und zu den Kurszeiten verfügbar bist?'}
              </DialogModalBase.Description>

              <DialogModalBase.Content>
                <DialogModalBase.Form>
                  <DialogModalBase.ButtonBox>
                    <DialogModalBase.Button
                      label={mode === 'quit' ? 'Kurs Entfernen' : 'Teilnehmen'}
                      onClick={submit}
                    />
                  </DialogModalBase.ButtonBox>
                </DialogModalBase.Form>
              </DialogModalBase.Content>
            </div>
          </div>
        )}
        {mode === 'join' && pageIndex === 1 && (
          <div>
            <DialogModalBase.Header>
              <DialogModalBase.Icon Icon={VideoIcon} />
              <DialogModalBase.Title>
                Erfolgreiche Registrierung
              </DialogModalBase.Title>
              <DialogModalBase.CloseButton />
            </DialogModalBase.Header>
            <div>
              <DialogModalBase.Description>
                Du hast dich erfolgreich für den Kurs{' '}
                <span style={{ fontStyle: 'italic' }}>{course.name}</span>{' '}
                angemeldet. Falls du kurzfristig doch nicht teilnehmen kannst,
                dann entferne den Kurs, damit dein Platz für andere
                Schüler*innen frei wird. <br />
                <br />
                In Vorbereitung auf den Kurs solltest du das Videokonferenz-Tool
                einmal testen.
              </DialogModalBase.Description>

              <DialogModalBase.Content>
                <DialogModalBase.Form>
                  <DialogModalBase.ButtonBox>
                    <DialogModalBase.Button
                      label="Teste Video-Chat"
                      onClick={submit}
                    />
                  </DialogModalBase.ButtonBox>
                </DialogModalBase.Form>
              </DialogModalBase.Content>
            </div>
          </div>
        )}
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default CourseConfirmationModal;
