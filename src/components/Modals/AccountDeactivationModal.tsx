import React, { useContext, useState } from 'react';
import DialogModalBase from './DialogModalBase';
import { UserContext } from '../../context/UserContext';
import { ReactComponent as Trashcan } from '../../assets/icons/trashcan.svg';
import { ApiContext } from '../../context/ApiContext';

const helperDeactivationReasons = [
  'Ich habe keine Zeit mehr mich zu engagieren.',
  'Ich konnte/wollte das Kennenlerngespräch nicht wahrnehmen.',
  'Ich habe keine Interesse mehr.',
  'Ich habe mich nur zu Testzwecken angemeldet.',
  'Ich habe eine andere Möglichkeit gefunden mich zu engagieren.',
  'Ich habe mir das Programm anders vorgestellt.',
  'Ich erfülle die Zugangsvoraussetzungen für die Projekte nicht.',
];

const pupilDeactivationReasons = [
  'Ich habe keine Zeit mehr.',
  'Ich habe keine Interesse mehr.',
  'Ich habe mich nur zu Testzwecken angemeldet.',
  'Ich habe eine andere Möglichkeit gefunden Unterstützung zu erhalten.',
  'Ich habe mir das Programm anders vorgestellt.',
  'Ich erfülle die Zugangsvoraussetzungen für die Projekte nicht.',
];

const accentColor = '#c44221';

const AccountDeactivationModal = () => {
  const userContext = useContext(UserContext);
  const apiContext = useContext(ApiContext);
  const [pageIndex, setPageIndex] = useState(0);
  const [reason, setReason] = useState(null);
  const [feedback, setFeedback] = useState('');

  const submit = () => {
    apiContext
      .putUserActiveFalse(reason, feedback)
      .then(() => window.location.assign('https://lern-fair.de/'));
  };

  const onClose = () => {
    setPageIndex(0);
    setReason(null);
    setFeedback('');
  };
  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="deactivateAccount">
        <DialogModalBase.Header>
          <DialogModalBase.Icon Icon={Trashcan} />
          <DialogModalBase.Title>Account deaktivieren</DialogModalBase.Title>
          <DialogModalBase.CloseButton hook={onClose} />
        </DialogModalBase.Header>
        <div>
          {pageIndex === 0 && (
            <div>
              <DialogModalBase.Description>
                Sobald du deinen Account deaktivierst, werden deine aktuellen
                Zuordnungen aufgelöst und deine Lernpartner*innen darüber
                informiert. Falls du zu einem späteren Zeitpunkt wieder Teil der
                Corona School werden möchtest, kannst du dich jederzeit wieder
                bei uns melden.
              </DialogModalBase.Description>
              <DialogModalBase.Content>
                <DialogModalBase.Form>
                  <DialogModalBase.InputCompound direction="vertical">
                    {Object.entries(
                      userContext.user.type === 'pupil'
                        ? pupilDeactivationReasons
                        : helperDeactivationReasons
                    ).map(([, value]) => (
                      <DialogModalBase.CheckboxSingle
                        key={value}
                        label={value}
                        value={value}
                        selected={reason}
                        onSelect={setReason}
                      />
                    ))}
                    <DialogModalBase.CheckboxSingle
                      label="Sonstiges"
                      value="Sonstiges"
                      selected={reason}
                      onSelect={setReason}
                    />
                    {reason === 'Sonstiges' && (
                      <>
                        <DialogModalBase.TextArea
                          label=""
                          onChange={(e) => setFeedback(e.target.value)}
                          value={feedback}
                        />
                        <DialogModalBase.Spacer />
                      </>
                    )}
                  </DialogModalBase.InputCompound>
                  <DialogModalBase.ButtonBox>
                    <DialogModalBase.Button
                      label="Weiter"
                      onClick={() => setPageIndex(1)}
                    />
                  </DialogModalBase.ButtonBox>
                </DialogModalBase.Form>
              </DialogModalBase.Content>
            </div>
          )}
          {pageIndex === 1 && (
            <div>
              <DialogModalBase.Description>
                Möchtest du deinen Abmeldegrund weiter ausführen, oder uns noch
                weiteres Feedback geben?
              </DialogModalBase.Description>
              <DialogModalBase.Content>
                <DialogModalBase.Form>
                  <DialogModalBase.TextArea
                    label=""
                    onChange={(e) => setFeedback(e.target.value)}
                    value={feedback}
                  />
                  <DialogModalBase.Spacer />
                  <DialogModalBase.ButtonBox>
                    <DialogModalBase.Button
                      label="Deaktivieren"
                      onClick={submit}
                    />
                  </DialogModalBase.ButtonBox>
                </DialogModalBase.Form>
              </DialogModalBase.Content>
            </div>
          )}
        </div>
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default AccountDeactivationModal;
