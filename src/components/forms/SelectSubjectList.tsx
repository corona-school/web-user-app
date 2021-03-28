import React from 'react';
import { Subject, SubjectName } from '../../types';
import Select from '../misc/Select';
import classes from './SelectProjectField.module.scss';
import Icons from '../../assets/icons';
import AccentColorButton from '../button/AccentColorButton';
import { subjectOptions as SubjectOptions } from '../../assets/subjects';

interface SelectSubjectProps {
  subject: Subject;
  changeSubject: (subject: Subject, newName: SubjectName) => void;
  changeRange: (subject: Subject, minGrade: number, maxGrade: number) => void;
  remove: (subject: Subject) => void;
  validSubjectOptions: SubjectName[];
}

const SelectSubject: React.FC<SelectSubjectProps> = ({
  subject,
  changeSubject,
  changeRange,
  remove,
  validSubjectOptions,
}) => {
  console.log(subject);

  const handleOnChangeMinGrade = (minGrade: number) => {
    if (subject.maxGrade < minGrade) {
      changeRange(subject, minGrade, minGrade);
    } else {
      changeRange(subject, minGrade, subject.maxGrade);
    }
  };

  function handleOnChangeMaxGrade(maxGrade: number) {
    if (!subject) return;

    if (subject.minGrade > maxGrade) {
      changeRange(subject, maxGrade, maxGrade);
    } else {
      changeRange(subject, subject.minGrade, maxGrade);
    }
  }

  return (
    <div>
      <Select
        onChange={(e) => changeSubject(subject, e.target.value)}
        value={subject.name}
        placeholder="Wähle ein Fach aus."
      >
        {SubjectOptions.map((o) => (
          <option value={o} disabled={!validSubjectOptions.includes(o)}>
            {o}
          </option>
        ))}
      </Select>
      <Select
        value={subject.minGrade}
        onChange={(e) => handleOnChangeMinGrade(Number(e.target.value))}
      >
        <option value="1">1. Klasse</option>
        <option value="2">2. Klasse</option>
        <option value="3">3. Klasse</option>
        <option value="4">4. Klasse</option>
        <option value="5">5. Klasse</option>
        <option value="6">6. Klasse</option>
        <option value="7">7. Klasse</option>
        <option value="8">8. Klasse</option>
        <option value="9">9. Klasse</option>
        <option value="10">10. Klasse</option>
        <option value="11">11. Klasse</option>
        <option value="12">12. Klasse</option>
        <option value="13">13. Klasse</option>
      </Select>
      -
      <Select
        value={subject.maxGrade}
        onChange={(e) => handleOnChangeMaxGrade(Number(e.target.value))}
      >
        <option value="1">1. Klasse</option>
        <option value="2">2. Klasse</option>
        <option value="3">3. Klasse</option>
        <option value="4">4. Klasse</option>
        <option value="5">5. Klasse</option>
        <option value="6">6. Klasse</option>
        <option value="7">7. Klasse</option>
        <option value="8">8. Klasse</option>
        <option value="9">9. Klasse</option>
        <option value="10">10. Klasse</option>
        <option value="11">11. Klasse</option>
        <option value="12">12. Klasse</option>
        <option value="13">13. Klasse</option>
      </Select>
      {subject && (
        <AccentColorButton
          onClick={(e) => {
            e.stopPropagation();
            remove(subject);
          }}
          label=""
          className={classes.deleteButton}
          accentColor="#e78b00"
          small
        >
          <Icons.Delete className={classes.deleteIcon} />
        </AccentColorButton>
      )}
    </div>
  );
};

interface SelectSubjectsProps {
  subjects: Subject[];
  onChange: (subjects: Subject[]) => void;
}

const SelectSubjectList: React.FC<SelectSubjectsProps> = ({
  subjects,
  onChange,
}) => {
  function handleChangeSubject(
    subject: Subject | undefined,
    newName: SubjectName
  ) {
    const subjectList = subjects.map((s) => {
      if (s.name === subject.name) {
        return { ...subject, name: newName };
      }
      return s;
    });
    onChange(subjectList);
  }

  function handleChangeRange(
    subject: Subject,
    minGrade: number,
    maxGrade: number
  ) {
    const subjectList = subjects.map((s) => {
      if (s.name === subject.name) {
        return { ...subject, minGrade, maxGrade };
      }
      return s;
    });
    onChange(subjectList);
  }

  function handleRemove(subject: Subject) {
    const subjectList = subjects.filter((s) => subject.name !== s.name);
    onChange(subjectList);
  }

  const validSubjectOptions = SubjectOptions.filter(
    (n) => !subjects.find((s) => s.name === n)
  );

  function addSubject() {
    onChange([
      ...subjects,
      { name: validSubjectOptions[0], minGrade: 1, maxGrade: 13 },
    ]);
  }

  return (
    <div>
      {subjects.map((s) => (
        <SelectSubject
          subject={s}
          changeSubject={handleChangeSubject}
          changeRange={handleChangeRange}
          remove={handleRemove}
          validSubjectOptions={validSubjectOptions}
        />
      ))}
      {validSubjectOptions.length > 0 && (
        <AccentColorButton
          onClick={(e) => {
            e.preventDefault();
            addSubject();
          }}
          label=""
          className={classes.addButton}
          accentColor="#e78b00"
          small
        >
          <Icons.Add className={classes.addIcon} />
        </AccentColorButton>
      )}
    </div>
  );
};

export default SelectSubjectList;
