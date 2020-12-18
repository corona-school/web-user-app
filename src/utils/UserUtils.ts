import { User } from '../types';

export const getUserType = (user: User) => {
  if (user.type === 'pupil') {
    return `Schüler*in`;
  }
  return `Student*in`;
};

export const getUserTags = (user: User) => {
  const studentTags = [];

  if (user.type === 'pupil') {
    return { pupil: 'Schüler*in' };
  }

  if (user.isTutor) {
    studentTags.push('Tutor*in');
  }

  if (user.isInstructor) {
    studentTags.push('Kursleiter*in');
  }

  if (user.isProjectCoach) {
    studentTags.push('Projektcoach*in');
  }
  return studentTags;
};

export const isProjectCoachButNotTutor = (user: User) =>
  !user.isTutor && user.isProjectCoach;

export const isProjectCoacheeButNotPupil = (user: User) =>
  !user.isPupil && user.isProjectCoachee;
