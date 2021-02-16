import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Card from './Card';
import { ProjectField, ProjectInformation } from '../../types';
import { IconButtonWrapper } from '../button';
import Context from '../../context';
import Icons from '../../assets/icons';
import { ApiProjectFieldInfo } from '../../types/ProjectCoach';
import Select from '../misc/Select';
import AccentColorButton from '../button/AccentColorButton';
import { ReactComponent as EditIcon } from '../../assets/icons/pen-solid.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/ico-delete.svg';
import { ReactComponent as AddIcon } from '../../assets/icons/plus-solid.svg';

const CardWrapper = styled.div`
  padding: 15px;
  box-shadow: none;
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
  width: 290px;
  position: relative;
  box-shadow: none;

  small {
    font-size: 14px;
    line-height: 21px;
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

const ProjectFieldCard: React.FC<{
  field: ProjectInformation;
  type: 'coachee' | 'coach';
}> = ({ field, type }) => {
  const [edit, setEdit] = useState(false);
  const [editMinGrade, setEditMinGrade] = useState(field.min || 1);
  const [editMaxGrade, setEditMaxGrade] = useState(field.max || 13);

  const apiContext = useContext(Context.Api);
  const userContext = useContext(Context.User);
  const isCoach = type === 'coach';

  const handleOnChangeMinGrade = (value: number): void => {
    setEditMinGrade(value);
    if (editMaxGrade < value) setEditMaxGrade(value);
  };
  const handleOnChangeMaxGrade = (value: number): void => {
    setEditMaxGrade(value);
    if (editMinGrade > value) setEditMinGrade(value);
  };
  const handleSave = () => {
    const modified: ProjectInformation = {
      name: field.name,
      min: editMinGrade,
      max: editMaxGrade,
    };
    const newProjectFields = userContext.user.projectFields.map((p) =>
      p.name === field.name ? modified : p
    );
    apiContext
      .putUserProjectFields(newProjectFields)
      .then(userContext.fetchUserData)
      .then(() => setEdit(false));
  };
  const handleDelete = () => {
    apiContext
      .putUserProjectFields(
        userContext.user.projectFields.filter((s) => s.name !== field.name)
      )
      .then(userContext.fetchUserData);
  };

  return (
    <CardWrapper>
      <StyledCard>
        {edit ? (
          <>
            {field.name}
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
                  accentColor="#4db534"
                  label="Speichern"
                  onClick={handleSave}
                />
              </IconButtonWrapper>
              <IconButtonWrapper>
                <AccentColorButton
                  label="Löschen"
                  onClick={handleDelete}
                  accentColor="#4db534"
                />
              </IconButtonWrapper>
            </SelectWrapper>
          </>
        ) : (
          <>
            {field.name}
            {isCoach && (
              <small>
                {field.min || 1}. Klasse - {field.max || 13}. Klasse
              </small>
            )}
            <IconButtonWrapper>
              <AccentColorButton
                Icon={isCoach ? EditIcon : DeleteIcon}
                label={isCoach ? 'Bearbeiten' : 'Entfernen'}
                onClick={isCoach ? () => setEdit(true) : handleDelete}
                accentColor="#4db534"
              />
            </IconButtonWrapper>
          </>
        )}
      </StyledCard>
    </CardWrapper>
  );
};

export default ProjectFieldCard;

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
  type: 'coachee' | 'coach';
  projectFields: ProjectField[];
}

export const AddProjectFieldCard: React.FC<Props> = ({
  type,
  projectFields,
}) => {
  const availableProjects = Object.values(ProjectField).filter(
    (p) => !projectFields.includes(p)
  );
  const [isEditing, setEditing] = useState(false);
  const [minGrade, setMinGrade] = useState(1);
  const [maxGrade, setMaxGrade] = useState(13);
  const [projectFieldName, setProjectFieldName] = useState<ProjectField>(
    availableProjects[0]
  );
  const apiContext = useContext(Context.Api);
  const userContext = useContext(Context.User);
  const isCoach = type === 'coach';

  const handleOnChangeMinGrade = (value: number): void => {
    setMinGrade(value);
    if (maxGrade < value) setMaxGrade(value);
  };

  const handleOnChangeMaxGrade = (value: number): void => {
    setMaxGrade(value);
    if (minGrade > value) setMinGrade(value);
  };

  const handleSave = () => {
    const newProjectField: ApiProjectFieldInfo = isCoach
      ? { name: projectFieldName, min: minGrade, max: maxGrade }
      : { name: projectFieldName };

    const newProjectFields = [
      ...userContext.user.projectFields,
      newProjectField,
    ];

    apiContext
      .putUserProjectFields(newProjectFields)
      .then(() => {
        const availableProjectFields = Object.values(ProjectField).filter(
          (p) => !newProjectFields.map((s) => s.name).includes(p)
        );
        setProjectFieldName(availableProjectFields[0]);
        return userContext.fetchUserData();
      })
      .then(() => setEditing(false));
  };

  return (
    <CardWrapper>
      <StyledCard highlightColor="blue">
        {isEditing ? (
          <>
            <div style={{ display: 'center' }}>
              <Select
                value={projectFieldName}
                onChange={(e) =>
                  setProjectFieldName(e.target.value as ProjectField)
                }
              >
                {Object.entries(ProjectField)
                  .filter((p) => !projectFields.includes(p[1]))
                  .map((p) => (
                    <option value={p[1]} key={p[0]}>
                      {p[1]}
                    </option>
                  ))}
              </Select>
            </div>
            {isCoach && (
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
              />
            </IconButtonWrapper>
            <CloseButtonStyle onClick={() => setEditing(false)}>
              <Icons.Close />
            </CloseButtonStyle>
          </>
        ) : (
          <>
            Neues Projektfeld
            {isCoach && <small>Jahrgangsstufen</small>}
            <IconButtonWrapper>
              <AccentColorButton
                Icon={AddIcon}
                label="Hinzufügen"
                onClick={() => setEditing(true)}
                accentColor="#0199cb"
              />
            </IconButtonWrapper>
          </>
        )}
      </StyledCard>
    </CardWrapper>
  );
};
