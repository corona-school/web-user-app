import React, { useState } from 'react';
import { CourseContainer } from '../components/container/CourseContainer';
import { Title } from '../components/Typography';

import classes from './CourseForm.module.scss';
import { CreateCourse } from '../components/forms/CreateCourse';
import { CreateSubCourse } from '../components/forms/CreateSubCourse';
import { Course, Lecture } from '../types/Course';
import { CreateLecture } from '../components/forms/CreateLecture';
import { useHistory } from 'react-router-dom';

export interface CompletedCourse extends Course {
  id: number;
}

export interface CompletedLecture extends Lecture {
  id: number;
}

export const CourseForm: React.FC = () => {
  const [position, setPosition] = useState(0);
  const [course, setCourse] = useState<CompletedCourse>(null);
  const [subCourses, setSubCourses] = useState([]);
  const [lectures, setLectures] = useState([]);

  const history = useHistory();

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
            history.push('/courses');
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
