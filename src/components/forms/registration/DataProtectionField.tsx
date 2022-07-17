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
              Datenschutzbestimmungen
            </a>{' '}
            zur Kenntnis genommen und bin damit einverstanden, dass der
            Lern-Fair e.V. meine persönlichen Daten entsprechend des Zwecks,
            Umfangs und der Dauer wie in der Datenschutzerklärung angegeben,
            verarbeitet und gespeichert werden.
            <br />
            Mir ist insbesondere bewusst, dass die von mir angegebenen Daten zur
            Durchführung der Angebote an zugeteilte Nutzer:innen weitergegeben
            werden und deren Mailadressen ggf. von Anbietern außerhalb der EU
            zur Verfügung gestellt werden, die die Einhaltung des europäischen
            Datenschutzniveaus nicht gewährleisten können.
            <br />
            Ich stimme ferner ausdrücklich der Verarbeitung meiner
            personenbezogenen Daten über unsere in den USA sitzenden
            Auftragsverarbeiter Google und Heroku zu, die die Einhaltung des
            europäischen Datenschutzniveaus aufgrund der Möglichkeit von
            Anfragen von US-Nachrichtendiensten nicht gewährleisten können. Zu
            diesem Zweck hat Lern-Fair Standardvertragsklauseln abgeschlossen
            und weitergehende Sicherheitsmaßnahmen vereinbart, Art. 46 Abs. 2
            lit. c DSGVO.
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
              Datenschutzbestimmungen des Lern-Fair e.V.
            </a>{' '}
            sowie die{' '}
            <a
              href="https://lern-fair.de/codu-studie-datenschutzerklaerung"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung der Studie <i>Corona & Du</i>
            </a>{' '}
            zur Kenntnis genommen und bin damit einverstanden, dass der
            Lern-Fair e.V. meine persönlichen Daten entsprechend des Zwecks,
            Umfangs und der Dauer wie in der Datenschutzerklärung angegeben,
            verarbeitet und gespeichert werden.
            <br />
            Mir ist insbesondere bewusst, dass die von mir angegebenen Daten zur
            Durchführung der Angebote an zugeteilte Nutzer:innen weitergegeben
            werden und deren Mailadressen ggf. von Anbietern außerhalb der EU
            zur Verfügung gestellt werden, die die Einhaltung des europäischen
            Datenschutzniveaus nicht gewährleisten können.
            <br />
            Ich stimme ich ferner ausdrücklich der Verarbeitung meiner
            personenbezogenen Daten über unsere in den USA sitzenden
            Auftragsverarbeiter Google und Heroku zu, die die Einhaltung des
            europäischen Datenschutzniveaus aufgrund der Möglichkeit von
            Anfragen von US-Nachrichtendiensten nicht gewährleisten können. Zu
            diesem Zweck hat Lern-Fair Standardvertragsklauseln abgeschlossen
            und weitergehende Sicherheitsmaßnahmen vereinbart, Art. 46 Abs. 2
            lit. c DSGVO.
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
