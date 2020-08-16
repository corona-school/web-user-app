import React from 'react';
import { useHistory } from 'react-router-dom';
import { CompletedCourse, CompletedLecture } from '../../routes/CourseForm';
import { CompletedSubCourse } from './CreateCourse';

import classes from './CourseSuccess.module.scss';
import Button from '../button';

import Images from '../../assets/images';

interface Props {
  course: CompletedCourse;
  subCourse: CompletedSubCourse;
  lectures: CompletedLecture[];
}

const CourseSuccess: React.FC<Props> = () => {
  const history = useHistory();

  return (
    <div className={classes.container}>
      <Images.Celebration width="400" height="400" />
      <Button
        onClick={() => {
          history.push('/courses');
        }}
        className={classes.button}
        color="white"
        backgroundColor="#4E6AE6"
      >
        Schließen
      </Button>
      <Button
        onClick={() => {
          window.location.reload();
        }}
        className={classes.button2}
        color="#4E6AE6"
        backgroundColor="white"
      >
        Weiteren Kurs erstellen
      </Button>
    </div>
  );
};

export default CourseSuccess;
