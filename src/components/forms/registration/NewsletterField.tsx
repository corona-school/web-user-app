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
          {props.isPupil
            ? ' Ich möchte den Newsletter der Corona School erhalten und über Angebote, Aktionen und weitere Unterstützungsmöglichkeiten per E-Mail informiert werden.'
            : 'Ich möchte über weitere Aktionen, Angebote und Unterstützungsmöglichkeiten der Corona School per E-Mail informiert werden. Dazu gehören Möglichkeiten zur Vernetzung mit anderen registrierten Studierenden, Mentoring und Nachrichten aus dem Organisationsteam.'}
        </Checkbox>
      </Checkbox.Group>
    </Form.Item>
  );
};
