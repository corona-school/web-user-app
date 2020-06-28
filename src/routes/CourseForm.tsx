import React, { useState } from 'react';
import { CourseContainer } from '../components/container/CourseContainer';
import { Title } from '../components/Typography';
import {
  CreateCourse,
  CompletedSubCourse,
} from '../components/forms/CreateCourse';
import { Course, Lecture } from '../types/Course';
import { CreateLecture } from '../components/forms/CreateLecture';
import CourseSuccess from '../components/forms/CourseSuccess';

import classes from './CourseForm.module.scss';

export interface CompletedCourse extends Course {
  id: number;
}

export interface CompletedLecture extends Lecture {
  subCourseId: number;
  id: number;
}

export const CourseForm: React.FC = () => {
  const [position, setPosition] = useState(0);
  const [course, setCourse] = useState<CompletedCourse>(null);
  const [subCourse, setSubCourse] = useState<CompletedSubCourse>(null);
  const [lectures, setLectures] = useState([]);

  const renderForm = () => {
    if (position === 0) {
      return (
        <CreateCourse
          setCourse={(course) => setCourse(course)}
          setSubCourse={(subCourse) => setSubCourse(subCourse)}
          onSuccess={() => {
            setPosition(1);
          }}
        />
      );
    }

    if (position === 1) {
      return (
        <CreateLecture
          lectures={lectures}
          subCourse={subCourse}
          course={course}
          next={() => {
            setPosition(2);
          }}
          onCancelLecture={(id) => {
            setLectures([...lectures.filter((s) => s.id !== id)]);
          }}
          onSuccess={(lecture) => {
            setLectures([...lectures, lecture]);
          }}
        />
      );
    }

    if (position === 2) {
      return (
        <CourseSuccess
          course={course}
          subCourse={subCourse}
          lectures={lectures}
        />
      );
    }
  };

  return (
    <CourseContainer position={position}>
      {position === 0 && <Title size="h2">Erstelle einen Kurs</Title>}
      {position === 1 && <Title size="h2">Lege deine Kurstermine fest</Title>}
      {position === 2 && (
        <Title size="h2">Der Kurs wurde erfolgreich erstellt.</Title>
      )}
      <div className={classes.formContainer}>{renderForm()}</div>
    </CourseContainer>
  );
};
