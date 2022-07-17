import { Checkbox, Form } from 'antd';
import React, { useContext } from 'react';
import StyledReactModal from 'styled-react-modal';
import classes from './DeclarationOfSelfCommitment.module.scss';
import context from '../../../context';

export const DeclarationOfSelfCommitment = (props) => {
  const modalContext = useContext(context.Modal);

  return (
    <>
      <AdditionalInformationModal />
      <Form.Item
        className={props.className}
        label="Selbstverpflichtungserklärung"
        name="declarationofcommitment"
        rules={[
          {
            required: true,
            message: 'Bitte akzeptiere die Selbstverpflichtungserklärung',
          },
        ]}
      >
        <Checkbox.Group className={classes.checkboxGroup}>
          <Checkbox value="declarationofcommitment">
            Ich versichere, nicht wegen einer in{' '}
            <a
              onClick={() =>
                modalContext.setOpenedModal('DeclarationOfCommitmentModal')
              }
              role="link"
              tabIndex={0}
              onKeyDown={() => {}}
            >
              § 72a Abs. 1 Satz 1 SGB VIII
            </a>{' '}
            bezeichneten Straftat rechtskräftig verurteilt worden zu sein und
            dass derzeit kein Ermittlungsverfahren wegen einer solchen Straftat
            gegen mich läuft.
          </Checkbox>
        </Checkbox.Group>
      </Form.Item>
    </>
  );
};

const AdditionalInformationModal = () => {
  const modalContext = useContext(context.Modal);

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'DeclarationOfCommitmentModal'}
      onEscapeKeydown={() => modalContext.setOpenedModal('')}
      onBackgroundClick={() => modalContext.setOpenedModal('')}
    >
      <div className={classes.modal}>
        <li>
          §§ 171, 174, 174 a-c: Verletzung der Fürsorge oder Erziehungspflicht;
          sexueller Missbrauch von Schutzbefohlenen; sexueller Missbrauch von
          Gefangenen, behördlich Verwahrten oder Kranken und Hilfsbedürftigen in
          Einrichtungen; sexueller Missbrauch unter Ausnutzung einer
          Amtsstellung; sexueller Missbrauch unter Ausnutzung eines Beratungs-,
          Behandlungs- oder Betreuungsverhältnisses
        </li>
        <li>
          §§ 176, 176a-b: sexueller Missbrauch von Kindern; Schwerer sexueller
          Missbrauch von Kindern; Sexueller Missbrauch von Kindern mit
          Todesfolge
        </li>
        <li>
          §§ 177, 178: Sexueller Übergriff, sexuelle Nötigung, Vergewaltigung;
          Sexueller Übergriff, sexuelle Nötigung und Vergewaltigung mit
          Todesfolge
        </li>
        <li>
          §§ 180, 180a, 181a: Förderung sexueller Handlungen Minderjähriger;
          Ausbeutung von Prostituierten; Zuhälterei
        </li>
        <li>§ 182: Sexueller Missbrauch von Jugendlichen</li>
        <li>
          §§ 183, 183a: Exhibitionistische Handlungen; Erregung öffentlichen
          Ärgernisses
        </li>
        <li>
          §§ 184, 184a-g, 284i, 184k: Verbreitung pornographischer Inhalte;
          Verbreitung gewalt- oder tierpornographischer Inhalte; Verbreitung,
          Erwerb und Besitz kinderpornographischer Inhalte; Verbreitung, Erwerb
          und Besitz jogendpornographischer Inhalte; Veranstaltung und Besuch
          kinder- und jugendpornographischer Darbietungen; Ausübung der
          verbotenen Prostitution; Jugendgefährdende Prostitution; Sexuelle
          Belästigung; Verletzung des Intimbereichs durch Bildaufnahmen
        </li>
        <li>
          § 201a Abs. 3: Verletzung des höchstpersönlichen Lebensbereichs und
          von Persönlichkeitsrechten durch Bildaufnahmen, die die Nacktheit
          einer anderen Person unter achtzehn Jahren zum Gegenstand hat.
        </li>
        <li>§ 225: Misshandlung von Schutzbefohlenen</li>
        <li>
          §§ 232-233a: Menschenhandel; Zwangsprostitution; Zwangsarbeit;
          Ausbeutung von Arbeitskraft; Ausbeutung unter Ausnutzung einer
          Freiheitsberaubung
        </li>
        <li>
          §§ 234, 235, 236: Menschenraub; Entziehung Minderjähriger;
          Kinderhandel
        </li>
      </div>
    </StyledReactModal>
  );
};
