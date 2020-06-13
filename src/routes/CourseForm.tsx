import React, { useState } from 'react';
import { CourseContainer } from '../components/container/CourseContainer';
import { Title } from '../components/Typography';

import classes from './CourseForm.module.scss';
import { CreateCourse } from '../components/forms/CreateCourse';
import { CreateSubCourse } from '../components/forms/CreateSubCourse';
import { Course } from '../types/Course';
import { CreateLecture } from '../components/forms/CreateLecture';

export interface CompletedCourse extends Course {
  id: number;
}

export const CourseForm: React.FC = () => {
  const [position, setPosition] = useState(2);
  const [course, setCourse] = useState<CompletedCourse>(null);
  const [subCourses, setSubCourses] = useState([]);
  const [lectures, setLectures] = useState([]);

  const renderForm = () => {
    if (position === 0) {
      return (
        <CreateCourse
          onSuccess={(course) => {
            setCourse(course);
            setPosition(1);
          }}
        />
      );
    }
    if (position === 1) {
      return (
        <CreateSubCourse
          courses={subCourses}
          course={course}
          next={() => {
            setPosition(2);
          }}
          onSuccess={(subCourse) => {
            setSubCourses([...subCourses, subCourse]);
          }}
        />
      );
    }
    if (position === 2) {
      return (
        <CreateLecture
          lectures={lectures}
          subCourses={subCourses}
          course={course}
          next={() => {
            console.log('submit');
          }}
          onSuccess={(lecture) => {
            setLectures([...lectures, lecture]);
          }}
        />
      );
    }
  };

  return (
    <CourseContainer position={position}>
      <Title size="h2">Erstelle einen Kurs</Title>

      <div className={classes.formContainer}>{renderForm()}</div>
    </CourseContainer>
  );
};
