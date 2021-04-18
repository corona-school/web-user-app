import { Form, Input } from 'antd';
import React, { useContext } from 'react';
import Context from '../../../context';

interface Props {
  className: string;
  initialValue?: string;
}

export const EmailField: React.FC<Props> = (props) => {
  const apiContext = useContext(Context.Api);

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
        {
          message: 'E-Mail ist ungültig oder existiert bereits!',
          validator: async (_, value) => {
            const res = await apiContext.checkEmail(value);
            if (res) {
              return Promise.resolve();
            }
            return Promise.reject();
          },
          validateTrigger: 'onSubmit',
        },
      ]}
    >
      <Input type="email" placeholder="max.musterman@email.com" />
    </Form.Item>
  );
};
