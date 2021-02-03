import { Form, Input } from 'antd';
import React from 'react';

interface Props {
  className: string;
  initialValue?: string;
}

export const EmailField: React.FC<Props> = (props) => {
  return (
    <Form.Item
      className={props.className}
      label="E-Mail-Adresse"
      name="email"
      initialValue={props.initialValue}
      rules={[
        {
          required: true,
          message: 'Bitte trage deine E-Mail-Adresse ein!',
        },
        {
          type: 'email',
          message: 'Bitte trage eine gültige E-Mail-Adresse ein!',
          validateTrigger: 'onSubmit',
        },
      ]}
    >
      <Input type="email" placeholder="max.musterman@email.com" />
    </Form.Item>
  );
};
