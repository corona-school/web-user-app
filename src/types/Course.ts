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
