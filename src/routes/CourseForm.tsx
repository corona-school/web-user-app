import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CourseContainer } from '../components/container/CourseContainer';
import { Title } from '../components/Typography';
import {
  CreateCourse,
  CompletedSubCourse,
} from '../components/forms/CreateCourse';
import { Course, Lecture, CourseOverview } from '../types/Course';
import { CreateLecture } from '../components/forms/CreateLecture';
import CourseSuccess from '../components/forms/CourseSuccess';

import classes from './CourseForm.module.scss';
import { ApiContext } from '../context/ApiContext';
import { dev } from '../api/config';

export interface CompletedCourse extends Course {
  id: number;
}

export interface CompletedLecture extends Lecture {
  subCourseId: number;
  id: number;
}

export interface CourseParams {
  id: string;
}

export const CourseForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [course, setCourse] = useState<CompletedCourse>(null);
  const [subCourse, setSubCourse] = useState<CompletedSubCourse>(null);
  const [lectures, setLectures] = useState([]);

  const api = useContext(ApiContext);

  const params = useParams<CourseParams | undefined>();

  const parseCourse = (course: CourseOverview) => ({
    id: course.id,
    instructors: course.instructors.map((i) => i.id),
    name: course.name,
    outline: course.outline,
    description: course.description,
    category: course.category,
    tags: course.tags.map((t) => t.id),
    submit: false,
  });

  const parseSubCourse = (course: CourseOverview) => {
    const subCourse = course.subcourses[0];

    if (!subCourse) {
      return null;
    }

    const completedSubCourse: CompletedSubCourse = {
      id: subCourse.id,
      instructors: subCourse.instructors.map((i) => i.id),
      minGrade: subCourse.minGrade,
      maxGrade: subCourse.maxGrade,
      maxParticipants: subCourse.maxParticipants,
      joinAfterStart: subCourse.joinAfterStart || false,
      published: subCourse.published || false,
    };

    return completedSubCourse;
  };

  const parseLectures = (course: CourseOverview) => {
    const subCourse = course.subcourses[0];

    if (!subCourse) {
      return null;
    }

    const lectures: CompletedLecture[] = subCourse.lectures.map((l) => ({
      id: l.id,
      subCourseId: subCourse.id,
      instructor: l.instructor.id,
      start: l.start,
      duration: l.duration,
    }));

    return lectures;
  };

  useEffect(() => {
    if (params && params.id) {
      setLoading(true);
      api
        .getCourse(params.id)
        .then((course) => {
          console.log(course.instructors);

          setCourse(parseCourse(course));
          setSubCourse(parseSubCourse(course));
          setLectures(parseLectures(course));
        })
        .catch((err) => {
          if (dev) console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [api, params]);

  const renderForm = () => {
    if (position === 0) {
      return (
        <CreateCourse
          edit={!!params?.id}
          course={course}
          subCourse={subCourse}
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
    return null;
  };

  if (loading) {
    return (
      <CourseContainer position={position}>
        <div className={classes.formContainer}>Kurs wird geladen...</div>
      </CourseContainer>
    );
  }

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
