import React, { useState } from 'react';
import { Select } from 'antd';
import { Option } from 'antd/es/mentions';
import { ProjectField, ProjectInformation } from '../../types';
import IconButton from '../button/IconButton';

interface SelectProjectFieldProps {
  projectField: ProjectInformation;
  changeProjectFieldRange: (
    projectField: ProjectInformation,
    [min, max]: [number, number]
  ) => void;
  changeProjectFieldName: (
    projectField: ProjectInformation,
    name: ProjectField
  ) => void;
  options: string[];
  remove: (projectField: ProjectInformation) => void;
}

const SelectProjectField: React.FC<SelectProjectFieldProps> = ({
  projectField,
  changeProjectFieldRange,
  changeProjectFieldName,
  options,
  remove,
}: SelectProjectFieldProps) => {
  const handleOnChangeMinGrade = (value: number): void => {
    changeProjectFieldRange(projectField, [value, projectField.max]);
    if (projectField.max < value)
      changeProjectFieldRange(projectField, [projectField.min, value]);
  };

  const handleOnChangeMaxGrade = (value: number): void => {
    changeProjectFieldRange(projectField, [projectField.min, value]);
    if (projectField.min > value)
      changeProjectFieldRange(projectField, [value, projectField.max]);
  };

  return (
    <div key={projectField.name}>
      <Select
        value={projectField.name}
        onChange={(value) => changeProjectFieldName(projectField, value)}
      >
        {options.map((o) => (
          <Option key={o} value={o}>
            {o}
          </Option>
        ))}
      </Select>
      <div>
        <div>
          Klasse
          <Select
            value={`${projectField.min}`}
            onChange={(e) => handleOnChangeMinGrade(Number(e))}
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
            value={`${projectField.max}`}
            onChange={(e) => handleOnChangeMaxGrade(Number(e))}
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
        </div>
        <div>
          <IconButton
            icon="Delete"
            onClick={(e) => {
              e.stopPropagation();
              remove(projectField);
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface SelectProjectListProps {
  value?: ProjectInformation[];
  onChange?: (value: ProjectInformation[]) => void;
}

const SelectProjectList: React.FC<SelectProjectListProps> = ({
  value = {},
  onChange,
}) => {
  const [projectFields, setProjectFields] = useState<ProjectInformation[]>(
    Array.isArray(value) ? value : []
  );

  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange(changedValue);
    }
  };

  const changeProjectFieldRange = (
    projectField: ProjectInformation,
    [min, max]: [number, number]
  ) => {
    const projectFieldList = projectFields.map((p) => {
      if (p.name === projectField.name) {
        return { ...projectField, min, max };
      }
      return p;
    });
    setProjectFields(projectFieldList);
    triggerChange(projectFieldList);
  };

  const changeProjectFieldName = (
    projectField: ProjectInformation,
    name: ProjectField
  ) => {
    const projectFieldList = projectFields.map((p) => {
      if (p.name === projectField.name) {
        return { ...projectField, name };
      }
      return p;
    });
    setProjectFields(projectFieldList);
    triggerChange(projectFieldList);
  };

  const addProjectField = () => {
    const remainingProjectFields = Object.keys(ProjectField).find(
      (n) => !projectFields.find((i) => i.name === n)
    );
    if (remainingProjectFields) {
      setProjectFields([
        ...projectFields,
        { name: ProjectField[remainingProjectFields].name, min: 1, max: 13 },
      ]);
      triggerChange([
        ...projectFields,
        { name: ProjectField[remainingProjectFields].name, min: 1, max: 13 },
      ]);
    }
  };

  const removeProjectField = (projectField: ProjectInformation) => {
    const newList = projectFields.filter((p) => projectField.name !== p.name);
    setProjectFields(newList);
    onChange(newList);
  };

  return (
    <div>
      {projectFields.map((projectField) => (
        <SelectProjectField
          projectField={projectField}
          changeProjectFieldRange={changeProjectFieldRange}
          changeProjectFieldName={changeProjectFieldName}
          options={Object.values(ProjectField).filter(
            (n) => !projectFields.find((i) => i.name === n)
          )}
          remove={removeProjectField}
        />
      ))}
      <div>
        <IconButton
          icon="Add"
          onClick={(e) => {
            e.preventDefault();
            addProjectField();
          }}
        />
      </div>
    </div>
  );
};

export default SelectProjectList;
