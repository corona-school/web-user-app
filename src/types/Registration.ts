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
  school: string;
  msg?: string;
  newsletter: boolean;
}

export interface Tutor {
  firstname: string;
  lastname: string;
  email: string;
  isOfficial: boolean;
  isTutor: boolean;
  // isOfficial
  state?: string;
  university?: string;
  module?: 'internship' | 'seminar';
  hours?: number;
  // isTutor
  subjects?: Subject[];
  // finnish
  newsletter: boolean;
  msg?: string;
}
