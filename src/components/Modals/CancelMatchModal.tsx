import React, { useState } from 'react';
import DialogModalBase from './DialogModalBase';
import { ReactComponent as Trashcan } from '../../assets/icons/trashcan.svg';
import {
  coacheeReasonOptions,
  coachReasonOptions,
  pupilReasonOptions,
  studentReasonOptions,
} from '../../assets/dissolveMatchReasons';

const accentColor = '#D03D53';

export default function CancelMatchModal({
  // identifier,
  // matchUuid,
  matchFirstname,
  ownType,
  projectCoaching,
}) {
  const [couldHelp, setCouldHelp] = useState(null);
  const [noHelpReason, setNoHelpReason] = useState(null);

  const [dissolved, setDissolved] = useState<boolean>(false);
  const [/* newMatchWanted, */ setNewMatchWanted] = useState<boolean | null>(
    null
  );
  // const { credentials } = useContext(Context.Auth);
  // const { user, fetchUserData } = useContext(Context.User);

  let reasonOptions: { [key: string]: string };

  if (projectCoaching && ownType === 'student')
    reasonOptions = coachReasonOptions;
  if (projectCoaching && ownType === 'pupil')
    reasonOptions = coacheeReasonOptions;
  if (!projectCoaching && ownType === 'student')
    reasonOptions = studentReasonOptions;
  if (!projectCoaching && ownType === 'pupil')
    reasonOptions = pupilReasonOptions;

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="cancelMatchModal">
        <DialogModalBase.Header>
          <DialogModalBase.Icon Icon={Trashcan} />
          <DialogModalBase.Title>Match auflösen</DialogModalBase.Title>
          <DialogModalBase.CloseButton
            stateSettingMethods={[
              setCouldHelp,
              setNoHelpReason,
              setDissolved,
              setNewMatchWanted,
            ]}
          />
        </DialogModalBase.Header>

        <DialogModalBase.Description>
          Schade, dass du die Zusammenarbeit beenden möchtest. Bitte teile uns
          mit, warum du dein Match auflöst.
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
                selected={couldHelp}
                onSelect={setCouldHelp}
                label="Ja"
              />
              <DialogModalBase.CheckboxSingle
                value={false}
                selected={couldHelp}
                onSelect={setCouldHelp}
                label="Nein"
              />
            </DialogModalBase.InputCompound>
          </DialogModalBase.Form>

          {couldHelp && ownType === 'student' && (
            <div>
              <DialogModalBase.Subheading>
                Vielen Dank für deine Hilfe!
              </DialogModalBase.Subheading>
              <DialogModalBase.Description>
                Ohne dich wäre dieses Projekt nicht möglich. Danke, dass du in
                dieser schwierigen Zeit gesellschaftliche Verantwortung
                übernommen hast!
                <br />
                Sobald du die Zusammenarbeit endgültig beendest, werden wird
                {matchFirstname} darüber per E-Mail informieren.
                {matchFirstname} hat dann die Möglichkeit, sich bei Bedarf neu
                verbinden zu lassen.
              </DialogModalBase.Description>
            </div>
          )}

          {couldHelp && ownType === 'pupil' && (
            <div>
              <DialogModalBase.Subheading>
                Vielen Dank für deine Rückmeldung!
              </DialogModalBase.Subheading>
              <DialogModalBase.Description>
                Sobald du die Zusammenarbeit endgültig beendest, werden wir
                {matchFirstname} darüber per E-Mail informieren.
                {matchFirstname} hat dann die Möglichkeit sich bei Bedarf neu
                verbinden zu lassen.
              </DialogModalBase.Description>
            </div>
          )}

          {couldHelp === false && (
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
                    value={value}
                    selected={noHelpReason}
                    onSelect={setNoHelpReason}
                  />
                ))}
              </DialogModalBase.InputCompound>
            </DialogModalBase.Form>
          )}
          {!dissolved && (
            <DialogModalBase.ButtonBox>
              <DialogModalBase.Button
                onClick={() => setDissolved(true)}
                label="Auflösen"
              />
            </DialogModalBase.ButtonBox>
          )}
        </DialogModalBase.Content>
        {dissolved && (
          <DialogModalBase.Subheading>
            Die Zusammenarbeit wurde erfolgreich beendet!
          </DialogModalBase.Subheading>
        )}
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
}
