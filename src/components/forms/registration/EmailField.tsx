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
      label="Deine persönliche E-Mail-Adresse"
      name="email"
      initialValue={props.initialValue}
      validateFirst
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
          validator: async (_, value) => apiContext.checkEmail(value),
          validateTrigger: 'onSubmit',
        },
      ]}
      extra="Trage hier deine persönliche E-Mail-Adresse ein. Stelle dabei sicher, dass du Zugriff auf diese E-Mail-Adresse hast. Nach der Registrierung erhältst du eine Verifizierungsmail von uns, in der du deine Anmeldung bestätigen musst."
    >
      <Input type="email" placeholder="max.musterman@email.com" />
    </Form.Item>
  );
};
