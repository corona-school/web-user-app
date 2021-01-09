export enum CourseState {
  CREATED = 'created',
  SUBMITTED = 'submitted',
  ALLOWED = 'allowed',
  DENIED = 'denied',
  CANCELLED = 'cancelled',
}

export enum CourseCategory {
  REVISION = 'revision',
  CLUB = 'club',
  COACHING = 'coaching',
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

export interface CourseParticipant extends Participant {
  grade: number;
  email: string;
  schooltype: string;
}

export interface CourseSubCourse {
  id: number;
  minGrade: number;
  maxGrade: number;
  maxParticipants: number;
  participants: number;
  instructors: Instructor[];
  lectures: CourseLecture[];
  joinAfterStart: boolean;
  participantList: CourseParticipant[];
  joined: boolean;
  onWaitingList: boolean;
  published: boolean;
  cancelled: boolean;
}

export interface Tag {
  id: string;
  name: string;
  category: string;
}
export interface TagAndCategory {
  ids: string[];
  name: string;
}

export interface CourseOverview {
  id: number;
  publicRanking: number;
  name: string;
  description: string;
  outline: string;
  state: CourseState;
  tags: Tag[];
  category: CourseCategory;
  instructors: Instructor[];
  subcourses: CourseSubCourse[];
  joinAfterStart: boolean;
  image?: string;
  allowContact: boolean;
}

export interface ParsedCourseOverview {
  id: number;
  publicRanking: number;
  name: string;
  description: string;
  outline: string;
  state: CourseState;
  tags: Tag[];
  category: CourseCategory;
  instructors: Instructor[];
  subcourse?: CourseSubCourse;
  image?: string;
  allowContact: boolean;
}

export interface Course {
  instructors: string[];
  name: string;
  outline: string;
  description: string;
  category: 'revision' | 'club' | 'coaching';
  tags: string[];
  submit: boolean;
  image?: string;
  allowContact: boolean;
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
