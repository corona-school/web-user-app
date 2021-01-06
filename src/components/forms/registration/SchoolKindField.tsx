import { Form, Select } from 'antd';
import React from 'react';

const { Option } = Select;

interface Props {
  isJufo?: boolean;
  className: string;
  defaultSchoolKind?: string;
}

export const SchoolKindField: React.FC<Props> = (props) => {
  return (
    <Form.Item
      className={props.className}
      label="Schulform"
      name="school"
      rules={[{ required: true, message: 'Bitte trage deine Schulform ein' }]}
      initialValue={props.defaultSchoolKind}
    >
      <Select placeholder="Grundschule..">
        <Option value="Grundschule">Grundschule</Option>
        <Option value="Gesamtschule">Gesamtschule</Option>
        <Option value="Hauptschule">Hauptschule</Option>
        <Option value="Realschule">Realschule</Option>
        <Option value="Gymnasium">Gymnasium</Option>
        <Option value="Förderschule">Förderschule</Option>
        {props.isJufo && <Option value="Berufsschule">Berufsschule</Option>}
        <Option value="other">Sonstige</Option>
      </Select>
    </Form.Item>
  );
};
