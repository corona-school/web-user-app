import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import { message } from 'antd';
import Card from './Card';
import { Subject, SubjectName } from '../../types';
import { IconButtonWrapper } from '../button';
import Context from '../../context';
import { subjectOptions } from '../../assets/subjects';
import Icons from '../../assets/icons';
import AccentColorButton from '../button/AccentColorButton';
import Select from '../misc/Select';
import { ReactComponent as AddIcon } from '../../assets/icons/plus-solid.svg';
import { ReactComponent as Trashcan } from '../../assets/icons/trashcan.svg';
import { ReactComponent as EditIcon } from '../../assets/icons/pen-solid.svg';

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
  width: 290px;
  position: relative;

  small {
    font-size: 14px;
    line-height: 21px;
    /* text-align: center; */
    letter-spacing: -0.333333px;
    color: ${(props) => props.theme.colorScheme.gray2};
  }
`;

const SelectWrapper = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  justify-content: space-evenly;
`;

const SubjectCard: React.FC<{
  subject: Subject;
  type: 'pupil' | 'student';
}> = ({ subject, type }) => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState<'save' | 'delete'>(null);
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
    setLoading('save');
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
      .then(() => {
        setEdit(false);
        setLoading(null);
      });
  };
  const handleDelete = () => {
    setLoading('delete');
    apiContext
      .putUserSubjects(
        userContext.user.subjects.filter((s) => s.name !== subject.name)
      )
      .then(userContext.fetchUserData)
      .then(() => setLoading(null));
  };

  const Loader = ({ color }) => {
    return (
      <div style={{ marginRight: 5 }}>
        <ClipLoader size={15} loading color={color} />
      </div>
    );
  };

  const getIcon = () => {
    if (loading != null) return () => Loader({ color: '#4db534' });
    return isStudent ? EditIcon : Trashcan;
  };

  return (
    <CardWrapper>
      <StyledCard>
        {edit ? (
          <>
            {subject.name}
            <SelectWrapper>
              <Select
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
              </Select>
              -
              <Select
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
              </Select>
            </SelectWrapper>
            <SelectWrapper>
              <IconButtonWrapper>
                <AccentColorButton
                  label="Speichern"
                  onClick={handleSave}
                  accentColor="#4db534"
                  small
                  Icon={
                    loading === 'save' ? () => <Loader color="#4db534" /> : null
                  }
                />
              </IconButtonWrapper>
              <IconButtonWrapper>
                <AccentColorButton
                  label="Löschen"
                  onClick={handleDelete}
                  accentColor="#dd0000"
                  small
                  Icon={
                    loading === 'delete'
                      ? () => <Loader color="#dd0000" />
                      : null
                  }
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
              <AccentColorButton
                Icon={getIcon()}
                label={isStudent ? 'Bearbeiten' : 'Entfernen'}
                onClick={isStudent ? () => setEdit(true) : handleDelete}
                accentColor="#4db534"
                small
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
  const availableSubjects = subjectOptions.filter((s) => !subjects.includes(s));
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [minGrade, setMinGrade] = useState(1);
  const [maxGrade, setMaxGrade] = useState(13);
  const [subjectName, setSubjectName] = useState<SubjectName>(
    availableSubjects[0]
  );
  const apiContext = useContext(Context.Api);
  const userContext = useContext(Context.User);
  const isStudent = type === 'student';

  const handleOnChangeMinGrade = (value: number): void => {
    setMinGrade(value);
    if (maxGrade < value) setMaxGrade(value);
  };

  const handleOnChangeMaxGrade = (value: number): void => {
    setMaxGrade(value);
    if (minGrade > value) setMinGrade(value);
  };

  const handleSave = () => {
    setLoading(true);
    const newSubject: Subject = isStudent
      ? { name: subjectName, minGrade, maxGrade }
      : { name: subjectName };

    const newSubjects = [...userContext.user.subjects, newSubject];

    apiContext
      .putUserSubjects(newSubjects)
      .catch((err) => {
        message.error('Etwas ist schief gelaufen 😬');
        console.log(err);
      })
      .then(() => {
        const availableSubjects = subjectOptions.filter(
          (s) => !newSubjects.map((s) => s.name).includes(s)
        );
        setSubjectName(availableSubjects[0]);
        return userContext.fetchUserData();
      })
      .then(() => {
        setLoading(false);
        setEditing(false);
      });
  };

  const Loader = () => {
    return (
      <div style={{ marginRight: 5 }}>
        <ClipLoader size={15} loading color="#0199cb" />
      </div>
    );
  };

  return (
    <CardWrapper>
      <StyledCard highlightColor="blue">
        {isEditing ? (
          <>
            <div style={{ display: 'center' }}>
              <Select
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value as SubjectName)}
              >
                {subjectOptions
                  .filter((s) => !subjects.includes(s))
                  .map((s) => (
                    <option value={s} key={s}>
                      {s}
                    </option>
                  ))}
              </Select>
            </div>
            {isStudent && (
              <SelectWrapper>
                <Select
                  value={minGrade}
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
                </Select>
                -
                <Select
                  value={maxGrade}
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
                </Select>
              </SelectWrapper>
            )}
            <IconButtonWrapper>
              <AccentColorButton
                accentColor="#0199cb"
                label="Speichern"
                onClick={handleSave}
                Icon={isLoading ? () => Loader() : null}
                small
              />
            </IconButtonWrapper>
            <CloseButtonStyle onClick={() => setEditing(false)}>
              <Icons.Close />
            </CloseButtonStyle>
          </>
        ) : (
          <>
            Neues Fach
            {isStudent && <small>Jahrgangsstufen</small>}
            <IconButtonWrapper>
              <AccentColorButton
                Icon={AddIcon}
                label="Hinzufügen"
                onClick={() => setEditing(true)}
                accentColor="#0199cb"
                small
              />
            </IconButtonWrapper>
          </>
        )}
      </StyledCard>
    </CardWrapper>
  );
};
