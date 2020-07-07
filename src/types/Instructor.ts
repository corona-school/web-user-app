import { Subject } from '.';

export interface BecomeInstructor {
  msg: string;
  isOfficial: boolean;
}

export interface BecomeIntern {
  msg: string;
  isOfficial: boolean;
  university: string;
  module: 'internship';
  state: string;
  hours: number;
  subjects: Subject[];
}
