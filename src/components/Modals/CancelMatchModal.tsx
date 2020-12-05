import React, { useContext, useState } from 'react';
import DialogModalBase from './DialogModalBase';
import { ReactComponent as Trashcan } from '../../assets/icons/trashcan.svg';
import Context from '../../context';
import {
  coacheeReasonOptions,
  coachReasonOptions,
  pupilReasonOptions,
  studentReasonOptions,
} from '../../assets/dissolveMatchReasons';
import { putUser } from '../../api/api';
import { dev } from '../../api/config';
import { ModalContext } from '../../context/ModalContext';

const accentColor = '#D03D53';

const CancelMatchModal: React.FC<{
  identifier: string;
  matchFirstname: string;
  matchUuid: string;
  ownType: 'pupil' | 'student';
  projectCoaching: boolean;
}> = ({ identifier, matchUuid, matchFirstname, ownType, projectCoaching }) => {
  const [supportSuccessful, setSupportSuccessful] = useState(null);
  const [noHelpReason, setNoHelpReason] = useState(null);
  const [dissolved, setDissolved] = useState<boolean>(false);
  const [newMatchWanted, setNewMatchWanted] = useState<boolean | null>(null);

  const apiContext = useContext(Context.Api);
  const { credentials } = useContext(Context.Auth);
  const { user, fetchUserData } = useContext(Context.User);

  const requestNewMatch = () => {
    if (projectCoaching && typeof user.projectMatchesRequested !== 'number') {
      return;
    }
    if (!projectCoaching && typeof user.matchesRequested !== 'number') return;
    putUser(credentials, {
      firstname: user.firstname,
      lastname: user.lastname,
      matchesRequested: projectCoaching
        ? user.matchesRequested
        : Math.min(user.matchesRequested + 1, 2),
      projectMatchesRequested: projectCoaching
        ? Math.min(user.projectMatchesRequested + 1, 2)
        : user.projectMatchesRequested,
      lastUpdatedSettingsViaBlocker: user.lastUpdatedSettingsViaBlocker,
    })
      .catch((err) => {
        if (dev) console.error(err);
      })
      .finally(() => {
        fetchUserData();
      });
  };

  const endCollaboration = () => {
    if (projectCoaching) {
      return apiContext.dissolveProjectMatch(
        matchUuid,
        supportSuccessful ? -1 : Number(noHelpReason)
      );
    }
    return apiContext.dissolveMatch(
      matchUuid,
      supportSuccessful ? -1 : Number(noHelpReason)
    );
  };

  const modalContext = useContext(ModalContext);

  const stateSettingMethods = [
    setSupportSuccessful,
    setNoHelpReason,
    setDissolved,
    setNewMatchWanted,
  ];

  let reasonOptions: { [key: string]: string };

  if (projectCoaching && ownType === 'student')
    reasonOptions = coachReasonOptions;
  if (projectCoaching && ownType === 'pupil')
    reasonOptions = coacheeReasonOptions;
  if (!projectCoaching && ownType === 'student')
    reasonOptions = studentReasonOptions;
  if (!projectCoaching && ownType === 'pupil')
    reasonOptions = pupilReasonOptions;

  const onModalClose = () => {
    if (newMatchWanted) requestNewMatch();
    else fetchUserData();
  };

  function closeModal(modalContext, stateSettingMethods) {
    modalContext.setOpenedModal(null);
    if (stateSettingMethods != null) {
      // can be optional
      stateSettingMethods.map(
        (method) => typeof method === 'function' && method(null)
      ); // Set all states stored in modal to null
    }
    onModalClose();
  }

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName={identifier}>
        <DialogModalBase.Header>
          <DialogModalBase.Icon Icon={Trashcan} />
          <DialogModalBase.Title>Match auflösen</DialogModalBase.Title>
          <DialogModalBase.CloseButton
            stateSettingMethods={stateSettingMethods}
            hook={onModalClose}
          />
        </DialogModalBase.Header>
        {!dissolved ? (
          <div>
            <DialogModalBase.Description>
              Schade, dass du die Zusammenarbeit beenden möchtest. Bitte teile
              uns mit, warum du dein Match auflöst.
            </DialogModalBase.Description>

            <DialogModalBase.Content>
              <DialogModalBase.Form>
                {ownType === 'pupil' ? (
                  <DialogModalBase.Subheading>
                    Konnte dich {matchFirstname} erfolgreich unterstützen?
                  </DialogModalBase.Subheading>
                ) : (
                  <DialogModalBase.Subheading>
                    Konntest du {matchFirstname} erfolgreich unterstützen?
                  </DialogModalBase.Subheading>
                )}
                <DialogModalBase.InputCompound direction="horizontal">
                  <DialogModalBase.CheckboxSingle
                    value
                    selected={supportSuccessful}
                    onSelect={setSupportSuccessful}
                    label="Ja"
                  />
                  <DialogModalBase.CheckboxSingle
                    value={false}
                    selected={supportSuccessful}
                    onSelect={setSupportSuccessful}
                    label="Nein"
                  />
                </DialogModalBase.InputCompound>
              </DialogModalBase.Form>

              {supportSuccessful && ownType === 'student' && (
                <div>
                  <DialogModalBase.Spacer />
                  <DialogModalBase.Subheading>
                    Vielen Dank für deine Hilfe!
                  </DialogModalBase.Subheading>
                  <DialogModalBase.Description>
                    Ohne dich wäre dieses Projekt nicht möglich. Danke, dass du
                    in dieser schwierigen Zeit gesellschaftliche Verantwortung
                    übernommen hast! <br />
                    <br />
                    Sobald du die Zusammenarbeit endgültig beendest, werden wir{' '}
                    {matchFirstname} darüber per E-Mail informieren.{' '}
                    {matchFirstname} hat dann die Möglichkeit, sich bei Bedarf
                    neu verbinden zu lassen.
                  </DialogModalBase.Description>
                </div>
              )}

              {supportSuccessful && ownType === 'pupil' && (
                <div>
                  <DialogModalBase.Spacer />
                  <DialogModalBase.Subheading>
                    Vielen Dank für deine Rückmeldung!
                  </DialogModalBase.Subheading>
                  <DialogModalBase.Description>
                    Sobald du die Zusammenarbeit endgültig beendest, werden wir{' '}
                    {matchFirstname} darüber per E-Mail informieren.{' '}
                    {matchFirstname} hat dann die Möglichkeit, sich bei Bedarf
                    neu verbinden zu lassen.
                  </DialogModalBase.Description>
                </div>
              )}

              {supportSuccessful === false && (
                <DialogModalBase.Form>
                  {ownType === 'student' ? (
                    <DialogModalBase.Subheading>
                      Warum konntest du {matchFirstname} nicht unterstützen?
                    </DialogModalBase.Subheading>
                  ) : (
                    <DialogModalBase.Subheading>
                      Warum konnte dich {matchFirstname} nicht unterstützen?
                    </DialogModalBase.Subheading>
                  )}
                  <DialogModalBase.InputCompound direction="vertical">
                    {Object.entries(reasonOptions).map(([key, value]) => (
                      <DialogModalBase.CheckboxSingle
                        key={key}
                        label={value}
                        value={key}
                        selected={noHelpReason}
                        onSelect={setNoHelpReason}
                      />
                    ))}
                  </DialogModalBase.InputCompound>
                </DialogModalBase.Form>
              )}
              {!dissolved &&
                supportSuccessful != null &&
                (supportSuccessful ||
                  (!supportSuccessful && noHelpReason != null)) && (
                  <DialogModalBase.ButtonBox>
                    <DialogModalBase.Button
                      onClick={() =>
                        endCollaboration().then(() => setDissolved(true))
                      }
                      label="Auflösen"
                    />
                  </DialogModalBase.ButtonBox>
                )}
            </DialogModalBase.Content>
          </div>
        ) : (
          <DialogModalBase.Content>
            <DialogModalBase.Description>
              Die Zusammenarbeit wurde erfolgreich beendet!
            </DialogModalBase.Description>

            <DialogModalBase.Form>
              <DialogModalBase.Subheading>
                {projectCoaching &&
                  `Möchtest du mit einem neuen ${
                    ownType === 'student' ? 'Coachee' : 'Coach'
                  } verbunden werden?`}
                {!projectCoaching &&
                  'Möchtest du mit einem/einer neuen Lernpartner*in verbunden werden?'}
              </DialogModalBase.Subheading>

              <DialogModalBase.InputCompound direction="horizontal">
                <DialogModalBase.CheckboxSingle
                  value
                  selected={newMatchWanted}
                  onSelect={setNewMatchWanted}
                  label="Ja"
                />
                <DialogModalBase.CheckboxSingle
                  value={false}
                  selected={newMatchWanted}
                  onSelect={setNewMatchWanted}
                  label="Nein"
                />
              </DialogModalBase.InputCompound>
              <DialogModalBase.ButtonBox>
                <DialogModalBase.Button
                  onClick={() => closeModal(modalContext, stateSettingMethods)}
                  label="Fertig"
                />
              </DialogModalBase.ButtonBox>
            </DialogModalBase.Form>
          </DialogModalBase.Content>
        )}
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default CancelMatchModal;
