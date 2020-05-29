import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Card from './Card';
import { Subject, SubjectName } from '../../types';
import IconButtonComponent, { IconButtonWrapper } from '../button/IconButton';
import Context from '../../context';
import { subjectOptions } from '../../assets/subjects';
import Icons from '../../assets/icons';

const IconButton = styled(IconButtonComponent)`
  width: unset;
  max-width: 179px;
  flex-grow: 1;
`;

const CardWrapper = styled.div`
  padding: 15px;
`;

const StyledCard = styled(Card)`
  align-items: stretch;
  color: ${(props) => props.theme.colorScheme.gray1};
  display: flex;
  flex-direction: column;
  font-size: 24px;
  height: 169px;
  justify-content: space-evenly;
  text-align: center;
  letter-spacing: -0.333333px;
  line-height: 36px;
  /* text-align: center; */
  width: 300px;
  width: 290px;
  position: relative;

  small {
    font-style: italic;
    font-size: 14px;
    line-height: 21px;
    /* text-align: center; */
    letter-spacing: -0.333333px;
    color: ${(props) => props.theme.colorScheme.gray2};
  }
`;

const SelectWrapper = styled.div`
  /* align-items: center; */
  align-self: stretch;
  display: flex;
  justify-content: space-evenly;
`;

const SelectStyle = styled.select`
  width: 110px;
  height: 28px;
  padding: 2px 5px;
  border: 1px solid ${(props) => props.theme.colorScheme.gray1};
  box-sizing: border-box;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: -0.333333px;
  color: ${(props) => props.theme.colorScheme.gray1};
`;

const SubjectCard: React.FC<{
  subject: Subject;
  type: 'pupil' | 'student';
}> = ({ subject, type }) => {
  const [edit, setEdit] = useState(false);
  const [editMinGrade, setEditMinGrade] = useState(subject.minGrade || 1);
  const [editMaxGrade, setEditMaxGrade] = useState(subject.maxGrade || 13);

  const apiContext = useContext(Context.Api);
  const userContext = useContext(Context.User);
  const isStudent = type === 'student';

  const handleOnChangeMinGrade = (value: number): void => {
    setEditMinGrade(value);
    if (editMaxGrade < value) setEditMaxGrade(value);
  };
  const handleOnChangeMaxGrade = (value: number): void => {
    setEditMaxGrade(value);
    if (editMinGrade > value) setEditMinGrade(value);
  };
  const handleSave = () => {
    const modified: Subject = {
      name: subject.name,
      minGrade: editMinGrade,
      maxGrade: editMaxGrade,
    };
    const newSubjects = userContext.user.subjects.map((s) =>
      s.name === subject.name ? modified : s
    );
    apiContext
      .putUserSubjects(newSubjects)
      .then(userContext.fetchUserData)
      .then(() => setEdit(false));
  };
  const handleDelete = () => {
    apiContext
      .putUserSubjects(
        userContext.user.subjects.filter((s) => s.name !== subject.name)
      )
      .then(userContext.fetchUserData);
  };

  return (
    <CardWrapper>
      <StyledCard>
        {edit ? (
          <>
            {subject.name}
            <SelectWrapper>
              <SelectStyle
                value={editMinGrade}
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
              </SelectStyle>
              -
              <SelectStyle
                value={editMaxGrade}
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
              </SelectStyle>
            </SelectWrapper>
            <SelectWrapper>
              <IconButtonWrapper>
                <IconButton
                  icon={'Save'}
                  label={'Speichern'}
                  onClick={handleSave}
                />
              </IconButtonWrapper>
              <IconButtonWrapper>
                <IconButton
                  icon={'Delete'}
                  label={'Löschen'}
                  onClick={handleDelete}
                />
              </IconButtonWrapper>
            </SelectWrapper>
          </>
        ) : (
          <>
            {subject.name}
            {isStudent && (
              <small>
                {subject.minGrade || 1}. Klasse - {subject.maxGrade || 13}.
                Klasse
              </small>
            )}
            <IconButtonWrapper>
              <IconButton
                icon={isStudent ? 'Edit' : 'Delete'}
                label={isStudent ? 'Bearbeiten' : 'Entfernen'}
                onClick={isStudent ? () => setEdit(true) : handleDelete}
              />
            </IconButtonWrapper>
          </>
        )}
      </StyledCard>
    </CardWrapper>
  );
};

export default SubjectCard;

const CloseButtonStyle = styled.button`
  position: absolute;
  width: 37px;
  height: 37px;
  right: 0;
  top: 0;

  border-radius: 4px;

  > * {
    position: absolute;
    width: 24px;
    height: 24px;
    left: 7px;
    top: 7px;
  }
`;

interface Props {
  type: 'pupil' | 'student';
  subjects: string[];
}

export const AddSubjectCard: React.FC<Props> = ({ type, subjects }) => {
  const [edit, setEdit] = useState(false);
  const [editMinGrade, setEditMinGrade] = useState(1);
  const [editMaxGrade, setEditMaxGrade] = useState(13);
  const [editName, setEditName] = useState<SubjectName>('Mathematik');
  const apiContext = useContext(Context.Api);
  const userContext = useContext(Context.User);
  const isStudent = type === 'student';

  const handleOnChangeName = (value: SubjectName): void => setEditName(value);
  const handleOnChangeMinGrade = (value: number): void => {
    setEditMinGrade(value);
    if (editMaxGrade < value) setEditMaxGrade(value);
  };
  const handleOnChangeMaxGrade = (value: number): void => {
    setEditMaxGrade(value);
    if (editMinGrade > value) setEditMinGrade(value);
  };
  const handleSave = () => {
    const newSubject: Subject = isStudent
      ? { name: editName, minGrade: editMinGrade, maxGrade: editMaxGrade }
      : { name: editName };
    apiContext
      .putUserSubjects([...userContext.user.subjects, newSubject])
      .then(userContext.fetchUserData)
      .then(() => setEdit(false));
  };

  return (
    <CardWrapper>
      <StyledCard highlightColor="blue">
        {edit ? (
          <>
            <div style={{ display: 'center' }}>
              <SelectStyle
                value={editName}
                onChange={(e) =>
                  handleOnChangeName(e.target.value as SubjectName)
                }
              >
                {subjectOptions
                  .filter((s) => !subjects.includes(s))
                  .map((s) => (
                    <option value={s} key={s}>
                      {s}
                    </option>
                  ))}
              </SelectStyle>
            </div>
            {isStudent && (
              <SelectWrapper>
                <SelectStyle
                  value={editMinGrade}
                  onChange={(e) =>
                    handleOnChangeMinGrade(Number(e.target.value))
                  }
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
                </SelectStyle>
                -
                <SelectStyle
                  value={editMaxGrade}
                  onChange={(e) =>
                    handleOnChangeMaxGrade(Number(e.target.value))
                  }
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
                </SelectStyle>
              </SelectWrapper>
            )}
            <IconButtonWrapper>
              <IconButton
                icon={'Save'}
                label={'Speichern'}
                onClick={handleSave}
              />
            </IconButtonWrapper>
            <CloseButtonStyle onClick={() => setEdit(false)}>
              <Icons.Close />
            </CloseButtonStyle>
          </>
        ) : (
          <>
            Neues Fach
            {isStudent && <small>Jahrgangsstufen</small>}
            <IconButtonWrapper>
              <IconButton
                icon={'Add'}
                label={'Hinzufügen'}
                onClick={() => setEdit(true)}
              />
            </IconButtonWrapper>
          </>
        )}
      </StyledCard>
    </CardWrapper>
  );
};
