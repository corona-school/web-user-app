import { Checkbox, Form } from 'antd';
import React from 'react';
import classes from './DataProtectionField.module.scss';

interface Props {
  className: string;
  isDrehtuer?: boolean;
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
        <Checkbox value="dataprotection">
          Ich habe die{' '}
          <a
            href="https://www.corona-school.de/datenschutz-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung
          </a>{' '}
          des Corona School e.V. zur Kenntnis genommen und willige in die
          Verarbeitung personenbezogener Daten zu den angegebenen Zwecken ein.{' '}
          {!props.isDrehtuer && (
            <>
              Mir ist insbesondere bekannt, dass meine Angaben an geeignete
              Matchingpartner*innen übermittelt werden. Die Verarbeitung der
              personenbezogenen Daten erfolgt auf privaten IT-Geräten der
              Matchingpartner*innen. Es kann im Rahmen der Übermittlung dazu
              kommen, dass personenbezogene Daten an E-Mail Server (bspw.
              google-mail oder @me.com) außerhalb der Europäischen Union
              übermittelt werden. In Ländern außerhalb der Europäischen Union
              besteht ggf. kein adäquates Datenschutzniveau. Zudem kann die
              Durchsetzung von Rechten erschwert bzw. ausgeschlossen sein. Mir
              sind diese Risiken bewusst und bekannt.
              <br />
              Mir ist außerdem bekannt, dass meine Einwilligung freiwillig und
              jederzeit mit Wirkung für die Zukunft widerruflich ist. Ein
              Widerruf der Einwilligung kann formlos erfolgen (bspw. an{' '}
              <a href="mailto:datenschutz@corona-school.de">
                datenschutz@corona-school.de
              </a>
              ). Mir ist bewusst, dass der Widerruf nur für die Zukunft gilt und
              daher Datenverarbeitungen bis zum Widerruf, insbesondere die
              Weitergabe von meinen personenbezogenen Daten an geeignete
              Matchingpartner*innen bis zum Zeitpunkt des Widerrufs unberührt
              bleiben. Weitere Datenschutzinformationen sind abrufbar unter{' '}
              <a
                href="https://www.corona-school.de/datenschutz-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.corona-school.de/datenschutz-2
              </a>
              .
            </>
          )}
          <br />
          <br />
          <span style={{ fontWeight: 'bold' }}>Hinweis:</span>{' '}
          <span style={{ fontStyle: 'italic' }}>
            Für den Fall, dass die einwilligende Person das 18. Lebensjahr noch
            nicht vollendet hat, hat der Träger der elterlichen Verantwortung
            für die Person die Einwilligung zu erklären.
          </span>
        </Checkbox>
      </Checkbox.Group>
    </Form.Item>
  );
};
