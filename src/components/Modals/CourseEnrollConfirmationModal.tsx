import React, { useContext } from 'react';
import { message } from 'antd';
import DialogModalBase from './DialogModalBase';
import Context from '../../context';
import { ModalContext } from '../../context/ModalContext';
import { ParsedCourseOverview } from '../../types/Course';
import { AuthContext } from '../../context/AuthContext';
import { ReactComponent as EnrollIcon } from '../../assets/icons/sign-in-alt-solid.svg';

const accentColor = '#009d41';

const CourseEnrollConfirmationModal: React.FC<{
  course: ParsedCourseOverview | null;
  setCourse: (any) => void;
}> = ({ course, setCourse }) => {
  const apiContext = useContext(Context.Api);
  const auth = useContext(AuthContext);
  const userId = auth.credentials.id;
  const modalContext = useContext(ModalContext);

  const submit = () => {
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
      modalContext.setOpenedModal(null);
    });
  };

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="courseEnrollConfirmationModal">
        <DialogModalBase.Header>
          <DialogModalBase.Icon Icon={EnrollIcon} />
          <DialogModalBase.Title>An Kurs teilnehmen</DialogModalBase.Title>
          <DialogModalBase.CloseButton />
        </DialogModalBase.Header>
        <div>
          <DialogModalBase.Description>
            Bist du dir sicher, dass du an dem Kurs teilnehmen möchtest?
          </DialogModalBase.Description>

          <DialogModalBase.Content>
            <DialogModalBase.Form>
              <DialogModalBase.ButtonBox>
                <DialogModalBase.Button label="Teilnehmen" onClick={submit} />
              </DialogModalBase.ButtonBox>
            </DialogModalBase.Form>
          </DialogModalBase.Content>
        </div>
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default CourseEnrollConfirmationModal;
