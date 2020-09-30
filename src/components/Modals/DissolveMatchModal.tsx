import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Modal from '.';
import Icons from '../../assets/icons';
import {
  pupilReasonOptions,
  studentReasonOptions,
} from '../../assets/dissolveMatchReasons';
import { ButtonDestructive, ButtonNonDestructive } from '../button';
import Context from '../../context';
import { putUser } from '../../api/api';
import { dev } from '../../api/config';

const Question = styled.div`
  color: ${(props) => props.theme.color.gray1};
  margin-top: 30px;

  .question {
    font-style: italic;
    font-size: 18px;
    line-height: 27px;
    margin-top: 0;
    margin-bottom: 15px;
  }

  > div {
    display: flex;
  }

  label {
    font-size: 14px;
    line-height: 21px;
    margin-left: 6px;
    margin-right: 16px;
  }
`;

const CheckboxButtonWrapper = styled.button`
  display: flex;
  position: static;
  left: 0px;
  top: 0px;
  font-size: 14px;
  line-height: 21px;
  cursor: pointer;
  margin-left: 15px;
  color: ${(props) => props.theme.color.gray1};

  > svg {
    height: 21px;
    width: 21px;
    flex-shrink: 0;
  }
`;

const Message = styled.div`
  font-size: 18px;
  line-height: 27px;
  color: ${(props) => props.theme.color.gray2};
  margin-top: 45px;
  margin-bottom: 30px;
`;

const CheckboxButton: React.FC<{
  checked: boolean;
  label: string;
  onClick: () => void;
}> = ({ checked, label, onClick }) => {
  return (
    <CheckboxButtonWrapper onClick={onClick}>
      {checked ? <Icons.CheckboxChecked /> : <Icons.CheckboxUnchecked />}
      {label}
    </CheckboxButtonWrapper>
  );
};

const DissolveMatchModal: React.FC<{
  identifier: string;
  matchFirstname: string;
  matchUuid: string;
  ownType: 'pupil' | 'student';
}> = ({ identifier, matchUuid, matchFirstname, ownType }) => {
  const [supportSuccessful, setSupportSuccessful] = useState<boolean | null>(
    null
  );
  const [reasonSelected, setReasonSelected] = useState<string | null>(null);
  const [dissolved, setDissolved] = useState<boolean>(false);
  const [newMatchWanted, setNewMatchWanted] = useState<boolean | null>(null);

  const apiContext = useContext(Context.Api);
  const modalContext = useContext(Context.Modal);
  const { credentials } = useContext(Context.Auth);
  const { user, fetchUserData } = useContext(Context.User);

  const requestNewMatch = () => {
    if (typeof user.matchesRequested !== 'number') return;
    putUser(credentials, {
      firstname: user.firstname,
      lastname: user.lastname,
      matchesRequested: Math.min(user.matchesRequested + 1, 2),
      lastUpdatedSettingsViaBlocker: user.lastUpdatedSettingsViaBlocker,
    })
      .catch((err) => {
        if (dev) console.error(err);
      })
      .finally(() => {
        fetchUserData();
      });
  };

  const endCollaboration = () =>
    apiContext.dissolveMatch(
      matchUuid,
      supportSuccessful ? -1 : Number(reasonSelected)
    );

  const reasonOptions =
    ownType === 'pupil' ? pupilReasonOptions : studentReasonOptions;

  return (
    <Modal
      identifier={identifier}
      title={dissolved ? 'Zusammenarbeit beendet' : 'Zusammenarbeit beenden'}
      subtitle={
        dissolved
          ? 'Die Zusammenarbeit wurde erfolgreich beendet!'
          : 'Schade, dass du die Zusammenarbeit beenden möchtest.'
      }
      beforeClose={newMatchWanted ? requestNewMatch : fetchUserData}
    >
      {dissolved ? (
        <>
          <Question>
            <p className="question">
              Möchtest du mit einem/einer neuen Lernpartner*in verbunden werden?
            </p>
            <div>
              <CheckboxButton
                label="Ja"
                checked={newMatchWanted === true}
                onClick={() => setNewMatchWanted(true)}
              />
              <CheckboxButton
                label="Nein"
                checked={newMatchWanted === false}
                onClick={() => setNewMatchWanted(false)}
              />
            </div>
          </Question>
          {newMatchWanted !== null && (
            <>
              <div style={{ height: '20px', flexShrink: 0 }} />
              <ButtonNonDestructive
                onClick={() => modalContext.setOpenedModal(null)}
              >
                Bestätigen
              </ButtonNonDestructive>
            </>
          )}
        </>
      ) : (
        <>
          <Question>
            {ownType === 'student' &&
              <p className="question">
                Konntest du {matchFirstname} erfolgreich unterstützen?
              </p>
            }
            {ownType === 'pupil' &&
              <p className="question">
                Konnte dich {matchFirstname} erfolgreich unterstützen?
              </p>
            }
            <div>
              <CheckboxButton
                label="Ja"
                checked={supportSuccessful === true}
                onClick={() => setSupportSuccessful(true)}
              />
              <CheckboxButton
                label="Nein"
                checked={supportSuccessful === false}
                onClick={() => setSupportSuccessful(false)}
              />
            </div>
          </Question>
          {(supportSuccessful === true && ownType === 'student') && (
            <>
              <Message>
                Wir möchten uns bei dir für deine Hilfe bedanken!
                <br />
                <br />
                Ohne dich wäre dieses Projekt nicht möglich. Danke, dass du in
                dieser schwierigen Zeit gesellschaftliche Verantwortung
                übernommen hast!
                <br />
                <br />
                Sobald du die Zusammenarbeit endgültig beendest, werden wir{' '}
                {matchFirstname} darüber per E-Mail informieren.{' '}
                {matchFirstname} hat dann die Möglichkeit sich bei Bedarf neu
                verbinden zu lassen.
              </Message>
              <ButtonDestructive
                onClick={() =>
                  endCollaboration().then(() => setDissolved(true))
                }
              >
                Zusammenarbeit endgültig beenden
              </ButtonDestructive>
            </>
          )}
          {(supportSuccessful === true && ownType === 'pupil') && (
            <>
              <Message>
                Vielen Dank für deine Rückmeldung!
                <br />
                <br />
                Sobald du die Zusammenarbeit endgültig beendest, werden wir{' '}
                {matchFirstname} darüber per E-Mail informieren.{' '}
                {matchFirstname} hat dann die Möglichkeit sich bei Bedarf neu
                verbinden zu lassen.
              </Message>
              <ButtonDestructive
                onClick={() =>
                  endCollaboration().then(() => setDissolved(true))
                }
              >
                Zusammenarbeit endgültig beenden
              </ButtonDestructive>
            </>
          )}
          {supportSuccessful === false && (
            <>
              <Question>
                {ownType === 'student' &&
                  <p className="question">
                    Warum konntest du {matchFirstname} nicht erfolgreich
                    unterstützen?
                  </p>
                }
                {ownType === 'pupil' &&
                  <p className="question">
                    Warum konnte dich {matchFirstname} nicht erfolgreich
                    unterstützen?
                  </p>
                }
                {Object.entries(reasonOptions).map(([key, value]) => (
                  <CheckboxButton
                    key={key}
                    label={value}
                    checked={reasonSelected === key}
                    onClick={() => setReasonSelected(key)}
                  />
                ))}
              </Question>
              {reasonSelected && (
                <>
                  <Message>
                    Vielen Dank für deine Rückmeldung.
                    <br />
                    <br />
                    Sobald du die Zusammenarbeit endgültig beendest, werden wir{' '}
                    {matchFirstname} darüber per E-Mail informieren.{' '}
                    {matchFirstname} hat dann die Möglichkeit sich bei Bedarf
                    neu verbinden zu lassen.
                  </Message>
                  <ButtonDestructive
                    onClick={() =>
                      endCollaboration().then(() => setDissolved(true))
                    }
                  >
                    Zusammenarbeit endgültig beenden
                  </ButtonDestructive>
                </>
              )}
            </>
          )}
        </>
      )}
      <div style={{ height: '20px', flexShrink: 0 }} />
    </Modal>
  );
};

export default DissolveMatchModal;
