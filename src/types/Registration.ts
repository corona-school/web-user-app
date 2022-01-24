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
  // isProjectCoachee
  isProjectCoachee: boolean;
  isJufoParticipant?: 'yes' | 'no' | 'unsure' | 'neverheard';
  projectFields?: string[];
  projectMemberCount?: number;
  msg?: string;
  newsletter: boolean;
  redirectTo?: string;
  teacherEmail?: string;
  registrationSource?: string;
  languages: string[];
  learningGermanSince?: string;
  requestsAutoMatch?: boolean;
  cToken?: string; // CoDu
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
  isCodu: boolean;
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
  jufoPastParticipationInfo?: string;
  projectFields?: string[];
  hasJufoCertificate?: boolean;
  // finnish
  newsletter: boolean;
  redirectTo?: string;
  registrationSource?: string;
  languages?: string[];
  supportsInDaz?: boolean;
}
