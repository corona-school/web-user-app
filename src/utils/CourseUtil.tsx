import { CourseOverview, ParsedCourseOverview } from '../types/Course';

export const parseCourse = (course: CourseOverview): ParsedCourseOverview => {
  return {
    id: course.id,
    publicRanking: course.publicRanking,
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

export const defaultPublicCourseSort = (a: ParsedCourseOverview, b: ParsedCourseOverview): number => {
  //1.: sort by manual public ranking
  const rankingOrder = b.publicRanking - a.publicRanking;

  if (rankingOrder !== 0) {
    return rankingOrder;
  }
  
  // (courses with subcourses will be preferred)
  const subcourseOrder = +(b.subcourse != null) - +(a.subcourse != null);

  if (subcourseOrder !== 0) {
    return subcourseOrder;
  }

  //2.: sort by remaining free spaces in the subcourse
  const A = a.subcourse;
  const B = b.subcourse;

  const leftPlacesPercentA = 1 - A.participants / A.maxParticipants;
  const leftPlacesPercentB = 1 - B.participants / B.maxParticipants;

  if (leftPlacesPercentA !== leftPlacesPercentB) {
    return leftPlacesPercentB - leftPlacesPercentA;
  }

  // (subcourses with lectures will be preferred)
  const lectureOrder = +(B.lectures?.length >= 1) - +(A.lectures?.length >= 1);
  
  //3.: sort by start date
  if (lectureOrder !== 0) {
    return lectureOrder;
  }

  const firstLectureA = A.lectures[0];
  const firstLectureB = B.lectures[0];

  return firstLectureA.start - firstLectureB.start;
}