import { Form, Select } from 'antd';
import React from 'react';

const { Option } = Select;

interface Props {
  emptyOption?: boolean;
  className: string;
  defaultGrade?: string;
  allowEverything?: boolean;
}

export const GradeField: React.FC<Props> = (props) => {
  return (
    <Form.Item
      className={props.className}
      label="Klasse"
      name="grade"
      rules={[
        {
          required: true,
          validator(_, value) {
            if ((props.allowEverything && value !== undefined) || value) {
              // accept everything, including undefined/no explicit grade information
              return Promise.resolve();
            }

            return Promise.reject('Bitte trage deine Klasse ein!');
          },
        },
      ]}
      initialValue={props.defaultGrade}
    >
      <Select placeholder="Bitte wähle deine Klasse aus">
        <Option value="1">1. Klasse</Option>
        <Option value="2">2. Klasse</Option>
        <Option value="3">3. Klasse</Option>
        <Option value="4">4. Klasse</Option>
        <Option value="5">5. Klasse</Option>
        <Option value="6">6. Klasse</Option>
        <Option value="7">7. Klasse</Option>
        <Option value="8">8. Klasse</Option>
        <Option value="9">9. Klasse</Option>
        <Option value="10">10. Klasse</Option>
        <Option value="11">11. Klasse</Option>
        <Option value="12">12. Klasse</Option>
        <Option value="13">13. Klasse</Option>
        {props.emptyOption && <Option value={null}>Keine Angabe</Option>}
      </Select>
    </Form.Item>
  );
};
