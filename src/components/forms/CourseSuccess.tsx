import React from 'react';
import { useHistory } from 'react-router-dom';
import { CompletedCourse, CompletedLecture } from '../../routes/CourseForm';
import { CompletedSubCourse } from './CreateCourse';

import classes from './CourseSuccess.module.scss';
import Button from '../button';

import Images from '../../assets/images';
import AccentColorButton from '../button/AccentColorButton';
import { ApiContext } from '../../context/ApiContext';
import { UserContext } from '../../context/UserContext';

interface Props {
  course: CompletedCourse;
  subCourse: CompletedSubCourse;
  lectures: CompletedLecture[];
  goBack: () => void;
}

const CourseSuccess: React.FC<Props> = ({
  goBack,
  course,
  subCourse,
  lectures,
}) => {
  const history = useHistory();
  const apiContext = React.useContext(ApiContext);
  const userContext = React.useContext(UserContext);

  const [published, setPublished] = React.useState(subCourse.published);

  async function publishCourse() {
    await apiContext.submitCourse(course.id, {
      ...course,
      submit: true,
      instructors: [userContext.user!.id],
    });
    await apiContext.publishSubCourse(course.id, subCourse.id, {
      ...subCourse,
      instructors: [userContext.user!.id],
    });
    setPublished(true);
  }

  return (
    <div className={classes.container}>
      <Images.Celebration width="400" height="400" />
      {!published && lectures.length > 0 && (
        <>
          <div>
            Dein Kurs wurde erstellt und kann bearbeitet werden. Soll er für
            Schüler sichtbar sein?
          </div>
          <AccentColorButton
            onClick={publishCourse}
            accentColor="#4E6AE6"
            label="Kurs veröffentlichen"
          />
          <AccentColorButton
            onClick={() => history.push(`/courses/${course.id}`)}
            accentColor="#GGGGGG"
            label="Später veröffentlichen"
          />
        </>
      )}
      {!published && lectures.length === 0 && (
        <>
          <div>
            Dein Kurs wurde erstellt und kann bearbeitet werden. Füge Termine
            hinzu, um den Kurs veröffentlichen zu können
          </div>
          <AccentColorButton
            onClick={goBack}
            accentColor="#4E6AE6"
            label="Termine hinzufügen"
          />

          <AccentColorButton
            onClick={() => history.push(`/courses/${course.id}`)}
            accentColor="#GGGGGG"
            label="Später veröffentlichen"
          />
        </>
      )}
      {published && (
        <div>
          Dein Kurs ist für Schüler sichtbar, sobald er von Lern-Fair
          freigegeben wurde.
          <AccentColorButton
            onClick={() => history.push(`/courses/${course.id}`)}
            accentColor="#GGGGGG"
            label="Schließen"
          />
        </div>
      )}
    </div>
  );
};

export default CourseSuccess;
