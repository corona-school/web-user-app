import { subjectOptions } from '../assets/subjects';

export enum ProjectField {
  ARBEITSWELT = 'Arbeitswelt',
  BIOLOGIE = 'Biologie',
  CHEMIE = 'Chemie',
  GEO_RAUM = 'Geo-und-Raumwissenschaften', // don't use spaces here due to a typeorm issue, see https://github.com/typeorm/typeorm/issues/5275
  MATHE_INFO = 'Mathematik/Informatik',
  PHYSIK = 'Physik',
  TECHNIK = 'Technik',
}

interface ProjectInformation {
  name: ProjectField;
  min: number;
  max: number;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  type: 'pupil' | 'student';
  active: boolean;
  grade?: number;
  matchesRequested?: number;
  isInstructor?: boolean;
  isTutor?: boolean;
  isProjectCoachee?: boolean;
  isPupil?: boolean;
  isParticipant?: boolean;
  isProjectCoach?: boolean;
  projectFields?: ProjectInformation[];
  subjects: Subject[];
  matches: Match[];
  dissolvedMatches: Match[];
  screeningStatus: ScreeningStatus;
  instructorScreeningStatus: ScreeningStatus;
  state?: string;
  university?: string;
  schoolType?: string;
  lastUpdatedSettingsViaBlocker: number;
  registrationDate: number;
}

export enum ScreeningStatus {
  Unscreened = 'UNSCREENED',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
}

export type SubjectName = typeof subjectOptions[number];

export interface Subject {
  name: SubjectName;
  minGrade?: number;
  maxGrade?: number;
}

export interface Match {
  uuid: string;
  firstname: string;
  lastname: string;
  date: number;
  grade?: number;
  subjects: string[];
  email: string;
  jitsilink: string;
}

export interface Credentials {
  id: string;
  token: string;
}

export type AuthStatusOptions =
  | 'pending'
  | 'missing'
  | 'authorized'
  | 'invalid';
