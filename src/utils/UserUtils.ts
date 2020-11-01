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

  if (user.isProjectCoach) {
    return 'Project-Coach';
  }

  return `Student*in`;
};

export const isProjectCoachButNotTutor = (user: User) =>
  !user.isTutor && user.isProjectCoach;

export const isProjectCoacheeButNotPupil = (user: User) =>
  !user.isPupil && user.isProjectCoachee;
