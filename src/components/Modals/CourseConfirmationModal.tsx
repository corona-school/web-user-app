import React, { useContext, useState } from 'react';
import { message } from 'antd';
import DialogModalBase from './DialogModalBase';
import Context from '../../context';
import { ModalContext } from '../../context/ModalContext';
import { ParsedCourseOverview } from '../../types/Course';
import { AuthContext } from '../../context/AuthContext';
import { ReactComponent as EnrollIcon } from '../../assets/icons/sign-in-alt-solid.svg';
import { ReactComponent as VideoIcon } from '../../assets/icons/video-solid.svg';

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
          },
        });
        message.success('Du bist dem Kurs beigetreten.');
        setPageIndex(1);
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
                {mode === 'quit' ? 'Kurs verlassen' : 'An Kurs teilnehmen'}
              </DialogModalBase.Title>
              <DialogModalBase.CloseButton />
            </DialogModalBase.Header>
            <div>
              <DialogModalBase.Description>
                Bist du dir sicher, dass du{' '}
                {mode === 'quit'
                  ? 'den Kurs verlassen'
                  : 'an dem Kurs teilnehmen'}{' '}
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
          </div>
        )}
        {mode === 'join' && pageIndex === 1 && (
          <div>
            <DialogModalBase.Header>
              <DialogModalBase.Icon Icon={VideoIcon} />
              <DialogModalBase.Title>Video-Chat testen</DialogModalBase.Title>
              <DialogModalBase.CloseButton />
            </DialogModalBase.Header>
            <div>
              <DialogModalBase.Description>
                Möchtest du den Video-Chat testen? Dieser Schritt ist optional.
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
