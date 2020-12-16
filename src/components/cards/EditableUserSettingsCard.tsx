import React from 'react';
import { Select, Input } from 'antd';
import { Text } from '../Typography';

import { StatesMap } from '../../assets/states';
import classes from './EditableUserSettingsCard.module.scss';
import { SchoolTypesMap } from '../../assets/schoolTypes';
import UniSelect from '../forms/select/UniSelect';

const SettingWrapper: React.FC<{
  title: string;
  value: string;
  isEditing: boolean;
  children: React.ReactNode;
}> = ({ title, value, isEditing, children }) => {
  return (
    <>
      <Text large bold>
        {title}
      </Text>
      {!isEditing && <Text large>{value}</Text>}
      <div className={classes.settingEditArea}>{isEditing && children}</div>
    </>
  );
};

export interface EditableUserSettings {
  university?: string;
  grade?: number;
  state?: string;
  schoolType?: string;
  phone?: string;
  phoneNr?: string;
  phonePrefix?: string;
}
interface Props {
  editableUserSettings: EditableUserSettings;
  onSettingChanges?: (newValue: EditableUserSettings) => void;
  isEditing?: boolean;
  personType: 'tutee' | 'tutor';
}
const EditableUserSettingsCard: React.FC<Props> = ({
  editableUserSettings,
  onSettingChanges,
  isEditing = false,
  personType,
}) => {
  return (
    <div className={classes.baseContainer}>
      {personType === 'tutor' && (
        <SettingWrapper
          title="Universität"
          value={editableUserSettings.university}
          isEditing={isEditing}
        >
          <UniSelect
            className={classes.settingEditAreaSelect}
            onChange={(v) => {
              onSettingChanges({
                ...editableUserSettings,
                university: v,
              });
            }}
            defaultValue={editableUserSettings.university}
          />
        </SettingWrapper>
      )}
      {personType === 'tutee' && (
        <SettingWrapper
          title="Klassenstufe"
          value={`${editableUserSettings.grade}. Klasse`}
          isEditing={isEditing}
        >
          <Select
            className={classes.settingEditAreaSelect}
            onChange={(selectedGrade) => {
              onSettingChanges({
                ...editableUserSettings,
                grade: parseInt(selectedGrade),
              });
            }}
            placeholder="Bitte wähle deine Klasse aus"
            defaultValue={
              editableUserSettings.grade
                ? `${editableUserSettings.grade}`
                : undefined
            }
          >
            {[...Array(13).keys()].map((i) => (
              <Select.Option value={`${i + 1}`} key={i}>{`${
                i + 1
              }. Klasse`}</Select.Option>
            ))}
          </Select>
        </SettingWrapper>
      )}
      <SettingWrapper
        title="Bundesland"
        value={StatesMap[editableUserSettings.state.toUpperCase()]}
        isEditing={isEditing}
      >
        <Select
          className={classes.settingEditAreaSelect}
          showSearch
          placeholder="Baden-Württemberg"
          defaultValue={editableUserSettings.state.toUpperCase()}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(selectedState) => {
            onSettingChanges({
              ...editableUserSettings,
              state: selectedState,
            });
          }}
        >
          {Object.entries(StatesMap).map(([abbrev, name]) => {
            return (
              <Select.Option key={abbrev} value={abbrev}>
                {name}
              </Select.Option>
            );
          })}
        </Select>
      </SettingWrapper>
      {personType === 'tutee' && (
        <SettingWrapper
          title="Schultyp"
          value={SchoolTypesMap[editableUserSettings.schoolType]}
          isEditing={isEditing}
        >
          <Select
            className={classes.settingEditAreaSelect}
            onChange={(selectedSchoolType) => {
              onSettingChanges({
                ...editableUserSettings,
                schoolType: selectedSchoolType,
              });
            }}
            placeholder="Grundschule.."
            defaultValue={editableUserSettings.schoolType}
          >
            {Object.entries(SchoolTypesMap).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </SettingWrapper>
      )}
      <SettingWrapper
        title="Handynummer"
        value={editableUserSettings.phone}
        isEditing={isEditing}
      >
        <Input
          addonBefore={
            <Select
              style={{
                width: 70,
              }}
              onChange={(selectedPhonePrefix) => {
                let { phoneNr } = editableUserSettings;
                if (!phoneNr && editableUserSettings.phone) {
                  phoneNr = editableUserSettings.phone.substring(3);
                }
                onSettingChanges({
                  ...editableUserSettings,
                  phonePrefix: selectedPhonePrefix,
                  phone: phoneNr ? selectedPhonePrefix + phoneNr : null,
                });
              }}
              defaultValue={
                editableUserSettings.phone
                  ? editableUserSettings.phone.substring(0, 3)
                  : editableUserSettings.phonePrefix || '+49'
              }
            >
              <Select.Option value="+49">+49</Select.Option>
              <Select.Option value="+41">+41</Select.Option>
              <Select.Option value="+43">+43</Select.Option>
            </Select>
          }
          className={classes.settingEditAreaSelect}
          style={{ width: '100%' }}
          onChange={(phoneNum) => {
            let { phonePrefix } = editableUserSettings;
            if (!phonePrefix && editableUserSettings.phone) {
              phonePrefix = editableUserSettings.phone.substring(0, 3);
            } else if (!phonePrefix) {
              phonePrefix = '+49';
            }
            onSettingChanges({
              ...editableUserSettings,
              phoneNr: parseInt(phoneNum.target.value)
                ? `${parseInt(phoneNum.target.value)}`
                : '',
              phone: parseInt(phoneNum.target.value)
                ? phonePrefix + parseInt(phoneNum.target.value)
                : null,
            });
          }}
          placeholder="1234567891"
          defaultValue={
            editableUserSettings.phone
              ? editableUserSettings.phone.substring(3)
              : ''
          }
        />
      </SettingWrapper>
    </div>
  );
};

export default EditableUserSettingsCard;
