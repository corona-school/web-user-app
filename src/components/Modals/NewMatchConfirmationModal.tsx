import React, { useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import DialogModalBase from './DialogModalBase';
import { ModalContext } from '../../context/ModalContext';
import Illustration from '../../assets/images/confirmNewMatchIllustration.png';
import { ReactComponent as Checkmark } from '../../assets/icons/check-double-solid.svg';
import { UserContext } from '../../context/UserContext';
import styles from './NewMatchConfirmationModal.module.scss';
import EditableUserSettingsCard, {
  EditableUserSettings,
} from '../cards/EditableUserSettingsCard';
import context from '../../context';

const accentColor = '#FFCC12';

/*
Used for confirming if a user actually wants to quit / join a course or not
 */
const NewMatchConfirmationModal: React.FC<{
  requestNewMatch: () => void;
}> = ({ requestNewMatch }) => {
  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const { user } = userContext;
  const [pageIndex, setPageIndex] = useState(0);
  const ApiContext = useContext(context.Api);

  const [editableUserSettings, setEditableUserSettings] = useState<
    EditableUserSettings
  >({
    state: user.state,
    grade: user.grade,
    schoolType: user.schoolType,
    university: user.university,
  });

  useEffect(() => {
    setEditableUserSettings({
      state: user.state,
      grade: user.grade,
      schoolType: user.schoolType,
      university: user.university,
    });
  }, [user.state, user.grade, user.schoolType, user.university]);

  const [isEditing, setIsEditing] = useState(false);
  const [, setIsSaving] = useState(false);

  const saveUserChanges = async () => {
    try {
      setIsSaving(true);
      await ApiContext.putUser({ ...user, ...editableUserSettings });
      setIsSaving(false);
      setIsEditing(false);
      return Promise.resolve();
    } catch {
      setIsSaving(false);
      return Promise.reject(
        'Ein Fehler ist aufgetreten. Probiere es noch einmal!'
      );
    }
  };

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="newMatchConfirmationModal">
        <div>
          <DialogModalBase.Header>
            <DialogModalBase.Icon Icon={Checkmark} />
            <DialogModalBase.Title>Neues Match anfordern</DialogModalBase.Title>
            <DialogModalBase.CloseButton hook={() => setPageIndex(0)} />
          </DialogModalBase.Header>

          {pageIndex === 0 && (
            <div>
              <div className={styles.illustrationWrapper}>
                <img
                  className={styles.illustration}
                  src={Illustration}
                  alt="Mensch, der sich verschiedene Optionen ansieht"
                />
              </div>

              <DialogModalBase.TextBlock>
                <h3>Wichtiger Hinweis</h3>
                <p>
                  Mit unserem Angebot möchten wir vor allem Schüler*innen
                  erreichen, die herkömmliche Nachhilfe aufgrund persönlicher,
                  sozialer, kultureller oder finanzieller Ressourcen nicht oder
                  nur sehr schwer wahrnehmen können. Bitte fordere nur dann
                  eine*n neue*n Lernpartner*in an, wenn du keine andere
                  Möglichkeit hast, Hilfe zu erhalten.
                </p>
                <p>
                  Unsere anderen Projekte, wie z.B. unsere Kurse stehen
                  weiterhin für alle Schüler*innen offen. Auf unserer Website
                  kannst du dir mehr Informationen dazu durchlesen.
                </p>
              </DialogModalBase.TextBlock>

              <DialogModalBase.Content>
                <DialogModalBase.Form>
                  <DialogModalBase.ButtonBox>
                    <DialogModalBase.Button
                      label="Fortfahren"
                      onClick={() => {
                        // requestNewMatch();
                        // modalContext.setOpenedModal(null);
                        setPageIndex(1);
                      }}
                    />
                  </DialogModalBase.ButtonBox>
                </DialogModalBase.Form>
              </DialogModalBase.Content>
            </div>
          )}
          {pageIndex === 1 && (
            <div>
              <DialogModalBase.Spacer />
              <h3>Überprüfe deine Informationen</h3>
              <p>
                Damit wir dir eine*n optimale*n Lernpartner*in zuteilen können,
                bitten wir dich deine persönlichen Informationen noch einmal zu
                überprüfen.
              </p>

              {/* <strong> */}
              {/*  <p> */}
              {/*    {user.firstname} {user.lastname} */}
              {/*  </p> */}
              {/* </strong> */}

              {/* <strong>Fächer</strong> */}
              {/* <p>{user.subjects.map((s) => s.name).join(', ')}</p> */}

              {/* <strong>Klassenstufe</strong> */}
              {/* <p>{user.grade}. Klasse</p> */}

              {/* <strong>Bundesland</strong> */}
              {/* <p>{user.state === 'other' ? 'anderer Wohnort' : user.state}</p> */}

              {/* <strong>Schultyp</strong> */}
              {/* <p> */}
              {/*  {user.schoolType === 'other' ? 'Sonstige' : user.schoolType} */}
              {/* </p> */}

              <EditableUserSettingsCard
                editableUserSettings={editableUserSettings}
                onSettingChanges={setEditableUserSettings}
                isEditing={isEditing}
                personType={user.type === 'pupil' ? 'tutee' : 'tutor'}
              />

              {/* <SettingsCard */}
              {/*  user={userContext.user} */}
              {/*  reloadCertificates={() => {}} */}
              {/* /> */}

              <DialogModalBase.Content>
                <DialogModalBase.Form>
                  <DialogModalBase.ButtonBox>
                    <DialogModalBase.Button
                      label={isEditing ? 'Speichern' : 'Daten aktualisieren'}
                      onClick={() => {
                        if (isEditing) {
                          saveUserChanges().then(
                            () =>
                              message.success('Änderungen wurden gespeichert!'),
                            (err) => message.error(err)
                          );
                        } else {
                          setIsEditing(!isEditing);
                        }
                      }}
                      accentColor="#626262"
                    />
                    {!isEditing && (
                      <DialogModalBase.Button
                        label="Fertig"
                        onClick={() => {
                          requestNewMatch();
                          modalContext.setOpenedModal(null);
                          setPageIndex(0);
                        }}
                      />
                    )}
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

export default NewMatchConfirmationModal;
