import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ScreeningStatus } from '../types';
import { ModalContext } from '../context/ModalContext';
import { UserContext } from '../context/UserContext';

const StudentCheck = () => {
  const userContext = useContext(UserContext);
  const modalContext = useContext(ModalContext);
  const history = useHistory();

  function getUserContext() {
    if (userContext.user.type !== 'student') {
      history.push('/');
    }
    if (
      (userContext.user.isTutor &&
        userContext.user.screeningStatus === ScreeningStatus.Unscreened) ||
      (userContext.user.isInstructor &&
        userContext.user.instructorScreeningStatus ===
          ScreeningStatus.Unscreened) ||
      (userContext.user.isProjectCoach &&
        userContext.user.projectCoachingScreeningStatus ===
          ScreeningStatus.Unscreened)
    ) {
      modalContext.setOpenedModal('accountNotScreened');
    }
  }
  useEffect(getUserContext, [userContext.user.screeningStatus]);
};

export default StudentCheck;
