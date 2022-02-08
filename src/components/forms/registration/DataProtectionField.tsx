import { Checkbox, Form } from 'antd';
import React from 'react';
import classes from './DataProtectionField.module.scss';

interface Props {
  className: string;
  isTutor: boolean;
  isDrehtuer?: boolean;
  isCodu?: boolean;
}

export const DataProtectionField: React.FC<Props> = (props) => {
  return (
    <Form.Item
      className={props.className}
      label="Datenschutzrechtliche Einwilligung"
      name="dataprotection"
      rules={[
        {
          required: true,
          message: 'Bitte akzeptiere die Datenschutzerklärung',
        },
      ]}
    >
      <Checkbox.Group className={classes.checkboxGroup}>
        {!props.isCodu && (
          <Checkbox value="dataprotection">
            Ich habe die{' '}
            <a
              href="https://www.lern-fair.de/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung
            </a>{' '}
            des Corona School e.V. zur Kenntnis genommen. Mir ist insbesondere
            bewusst, dass die von mir angegebenen Daten zur Durchführung der
            Angebote an zugeteilte {props.isTutor ? "Schüler:innen" : "Helfer:innen"} weitergegeben werden.
            <br />
            <br />
            <span style={{ fontWeight: 'bold' }}>Hinweis:</span>{' '}
            <span style={{ fontStyle: 'italic' }}>
              Für den Fall, dass die einwilligende Person das 18. Lebensjahr
              noch nicht vollendet hat, hat der Träger der elterlichen
              Verantwortung für die Person die Einwilligung zu erklären.
            </span>
          </Checkbox>
        )}
        {props.isCodu && (
          <Checkbox value="dataprotection">
            Ich habe die{' '}
            <a
              href="https://www.lern-fair.de/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung des Corona School e.V.
            </a>{' '}
            sowie die{' '}
            <a
              href="https://lern-fair.de/codu-studie-datenschutzerklaerung"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung der Studie <i>Corona & Du</i>
            </a>{' '}
            zur Kenntnis genommen. Mir ist insbesondere bewusst, dass die von
            mir angegebenen Daten zur Durchführung der Angebote an zugeteilte
            {props.isTutor ? "Schüler:innen" : "Helfer:innen"} weitergegeben werden.
            <br />
            <br />
            <span style={{ fontWeight: 'bold' }}>Hinweis:</span>{' '}
            <span style={{ fontStyle: 'italic' }}>
              Für den Fall, dass die einwilligende Person das 18. Lebensjahr
              noch nicht vollendet hat, hat der Träger der elterlichen
              Verantwortung für die Person die Einwilligung zu erklären.
            </span>
          </Checkbox>
        )}
      </Checkbox.Group>
    </Form.Item>
  );
};
