import { Subject } from '.';

export interface Tutee {
  firstname: string;
  lastname: string;
  email: string;
  grade: number;
  isTutee: boolean;
  // isTutee
  subjects?: Subject[];
  state: string;
  school?: string;
  // isProjectMentee
  isProjectMentee: boolean;
  isJufoParticipant?: 'yes' | 'no' | 'unsure' | 'neverheard';
  projectFields?: string[];
  msg?: string;
  newsletter: boolean;
  redirectTo?: string;
  teacherEmail?: string;
}

export interface SchoolInfo {
  name: string;
  emailDomain: string;
}

export interface Tutor {
  firstname: string;
  lastname: string;
  email: string;
  isOfficial: boolean;
  isTutor: boolean;
  isInstructor: boolean;
  // isOfficial
  state?: string;
  university?: string;
  module?: 'internship' | 'seminar' | 'other';
  hours?: number;
  // isTutor
  subjects?: Subject[];
  msg?: string;
  // isProjectCoach
  isProjectCoach: boolean;
  isUniversityStudent?: boolean;
  wasJufoParticipant?: 'yes' | 'no' | 'idk';
  projectFields?: string[];
  // finnish
  newsletter: boolean;
  redirectTo?: string;
}
