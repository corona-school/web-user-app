export interface Mentoring {
  title?: string;
  description?: string;
  id?: string;
  name?: string;
  link?: string;
}

export enum MentoringCategory {
  LANGUAGE = 'language',
  SUBJECTS = 'subjects',
  DIDACTIC = 'didactic',
  TECH = 'tech',
  SELFORGA = 'selforga',
  OTHER = 'other',
}

export interface MenteeMessage {
  category: MentoringCategory;
  emailText: string;
}
