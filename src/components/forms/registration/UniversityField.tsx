import { Form } from 'antd';
import React from 'react';
import UniSelect from '../select/UniSelect';

interface Props {
  className: string;
  defaultUniversity?: string;
  required?: boolean;
}

export const UniversityField: React.FC<Props> = (props) => {
  return (
    <Form.Item
      className={props.className}
      label="Universität/Hochschule"
      name="university"
      rules={[{ required: !!props.required }]}
      initialValue={props.defaultUniversity}
    >
      <UniSelect />
    </Form.Item>
  );
};
