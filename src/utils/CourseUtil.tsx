import { CourseOverview, ParsedCourseOverview } from '../types/Course';

export const parseCourse = (course: CourseOverview): ParsedCourseOverview => {
  return {
    id: course.id,
    name: course.name,
    description: course.description,
    outline: course.outline,
    state: course.state,
    tags: course.tags,
    category: course.category,
    instructors: course.instructors,
    subcourse: course.subcourses[0],
  };
};
