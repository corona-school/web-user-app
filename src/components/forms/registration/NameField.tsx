import { Form, Input } from 'antd';
import React from 'react';
import classes from './NameField.module.scss';

interface Props {
  firstname?: string;
  lastname?: string;
  className: string;
}

export const NameField: React.FC<Props> = (props) => {
  return (
    <div className={classes.formContainerGroup}>
      <Form.Item
        className={props.className}
        label="Vorname"
        name="firstname"
        rules={[{ required: true, message: 'Bitte trage deinen Vornamen ein' }]}
        initialValue={props.firstname}
      >
        <Input placeholder="Max" />
      </Form.Item>
      <Form.Item
        className={props.className}
        label="Nachname"
        name="lastname"
        rules={[
          { required: true, message: 'Bitte trage deinen Nachnamen ein' },
        ]}
        initialValue={props.lastname}
      >
        <Input placeholder="Mustermann" />
      </Form.Item>
    </div>
  );
};
