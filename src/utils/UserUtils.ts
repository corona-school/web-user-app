import { User } from '../types';

export const getUserType = (user: User) => {
  if (user.type === 'pupil') {
    return `Schüler*in`;
  }

  if (user.isTutor) {
    return `Student*in`;
  }

  if (user.isInstructor) {
    return 'Tutor*in';
  }

  return `Student*in`;
};
