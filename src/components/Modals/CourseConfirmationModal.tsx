import React, { useContext } from 'react';
import { message } from 'antd';
import DialogModalBase from './DialogModalBase';
import Context from '../../context';
import { ModalContext } from '../../context/ModalContext';
import { ParsedCourseOverview } from '../../types/Course';
import { AuthContext } from '../../context/AuthContext';
import { ReactComponent as EnrollIcon } from '../../assets/icons/sign-in-alt-solid.svg';

const accentColorJoin = '#009d41';
const accentColorQuit = '#9d0025';

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
          message.success('Du hast den Kurs verlassen.');
          modalContext.setOpenedModal(null);
        });
    } else {
      apiContext.joinCourse(course.id, course.subcourse.id, userId).then(() => {
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
        modalContext.setOpenedModal(null);
      });
    }
  };

  return (
    <DialogModalBase
      accentColor={mode === 'quit' ? accentColorQuit : accentColorJoin}
    >
      <DialogModalBase.Modal modalName="courseConfirmationModal">
        <DialogModalBase.Header>
          <DialogModalBase.Icon Icon={EnrollIcon} />
          <DialogModalBase.Title>
            {mode === 'quit' ? 'Kurs verlassen' : 'An Kurs teilnehmen'}
          </DialogModalBase.Title>
          <DialogModalBase.CloseButton />
        </DialogModalBase.Header>
        <div>
          <DialogModalBase.Description>
            Bist du dir sicher, dass du{' '}
            {mode === 'quit' ? 'den Kurs verlassen' : 'an dem Kurs teilnehmen'}{' '}
            möchtest?
          </DialogModalBase.Description>

          <DialogModalBase.Content>
            <DialogModalBase.Form>
              <DialogModalBase.ButtonBox>
                <DialogModalBase.Button
                  label={mode === 'quit' ? 'Verlassen' : 'Teilnehmen'}
                  onClick={submit}
                />
              </DialogModalBase.ButtonBox>
            </DialogModalBase.Form>
          </DialogModalBase.Content>
        </div>
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default CourseConfirmationModal;
