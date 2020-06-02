import { subjectOptions } from '../assets/subjects';

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  type: 'pupil' | 'student';
  active: boolean;
  grade?: number;
  matchesRequested?: number;
  subjects: Subject[];
  matches: Match[];
  screeningStatus: ScreeningStatus;
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

export interface CourseOverview {
  id: number;
  name: string;
  outline: string;
  category: string;
  startDate: number;
  instructor: string;
}
