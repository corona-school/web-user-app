import { User } from '../types';

export const getUserType = (user: User) => {
  if (user.type === 'pupil') {
    return `Schüler*in`;
  }
  return `Student*in`;
};

export const isProjectCoachButNotTutor = (user: User) =>
  !user.isTutor && user.isProjectCoach;

export const isProjectCoacheeButNotPupil = (user: User) =>
  !user.isPupil && user.isProjectCoachee;
