export enum CourseState {
  SUBMITTED = 'submitted',
  CREATED = 'created',
  ALLOWED = 'allowed',
}

export enum CourseCategory {
  REVISION = 'revision',
  CLUB = 'club',
}

export interface Instructor {
  firstname: string;
  lastname: string;
  id?: string;
}

export interface CourseLecture {
  id: number;
  start: number;
  duration: number;
  instructor: Instructor;
}

export interface Participant {
  firstname: string;
  lastname: string;
}

export interface CourseSubCourse {
  id: number;
  minGrade: number;
  maxGrade: number;
  maxParticipants: number;
  participants: number;
  instructors: Instructor[];
  lectures: Lecture[];
  joinAfterStart: boolean;
  participantList: Participant[];
}

export interface Tag {
  id: string;
  name: string;
  category: string;
}

export interface CourseOverview {
  id: number;
  name: string;
  description: string;
  outline: string;
  state: CourseState;
  tags: Tag[];
  category: CourseCategory;
  instructors: Instructor[];
  subcourses: CourseSubCourse[];
}

export interface Course {
  instructors: string[];
  name: string;
  outline: string;
  description: string;
  category: 'revision' | 'club' | 'coaching';
  tags: string[];
  submit: boolean;
}

export interface SubCourse {
  instructors: string[];
  minGrade: number;
  maxGrade: number;
  maxParticipants: number;
  joinAfterStart: boolean;
  published: boolean;
}

export interface Lecture {
  instructor: string;
  start: number;
  duration: number;
}
