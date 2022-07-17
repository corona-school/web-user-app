import { Checkbox, Form } from 'antd';
import React from 'react';
import classes from './NewsletterField.module.scss';

interface Props {
  className: string;
  defaultChecked?: boolean;
  isPupil?: boolean;
}

export const NewsletterField: React.FC<Props> = (props) => {
  return (
    <Form.Item className={props.className} label="Newsletter" name="newsletter">
      <Checkbox.Group className={classes.checkboxGroup}>
        <Checkbox value="newsletter" defaultChecked={props.defaultChecked}>
          Ich möchte den Newsletter von Lern-Fair erhalten und über Angebote,
          Aktionen und weitere Unterstützungsmöglichkeiten per E-Mail informiert
          werden.
        </Checkbox>
      </Checkbox.Group>
    </Form.Item>
  );
};
