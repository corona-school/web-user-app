import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import DialogModalBase from './DialogModalBase';
import { ModalContext } from '../../context/ModalContext';
import Illustration from '../../assets/images/confirmNewMatchIllustration.png';
import { ReactComponent as Checkmark } from '../../assets/icons/check-double-solid.svg';
import { UserContext } from '../../context/UserContext';

const accentColor = '#FFCC12';

/*
Used for confirming if a user actually wants to quit / join a course or not
 */
const NewMatchConfirmationModal: React.FC<{
  requestNewMatch: () => void;
}> = ({ requestNewMatch }) => {
  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const history = useHistory();
  const { user } = userContext;
  const [pageIndex, setPageIndex] = useState(0);

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
              <img
                style={{
                  width: '100%',
                }}
                src={Illustration}
                alt="Mensch, der sich verschiedene Optionen ansieht"
              />
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

              <strong>
                <p>
                  {user.firstname} {user.lastname}
                </p>
              </strong>

              <strong>Fächer</strong>
              <p>{user.subjects.map((s) => s.name).join(', ')}</p>

              <strong>Klassenstufe</strong>
              <p>{user.grade}. Klasse</p>

              <strong>Bundesland</strong>
              <p>{user.state === 'other' ? 'anderer Wohnort' : user.state}</p>

              <strong>Schultyp</strong>
              <p>
                {user.schoolType === 'other' ? 'Sonstige' : user.schoolType}
              </p>

              <DialogModalBase.Content>
                <DialogModalBase.Form>
                  <DialogModalBase.ButtonBox>
                    <DialogModalBase.Button
                      label="Daten aktualisieren"
                      onClick={() => {
                        modalContext.setOpenedModal(null);
                        setPageIndex(0);
                        history.push('/settings');
                      }}
                      accentColor="#626262"
                    />
                    <DialogModalBase.Button
                      label="Fertig"
                      onClick={() => {
                        requestNewMatch();
                        modalContext.setOpenedModal(null);
                        setPageIndex(0);
                      }}
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

export default NewMatchConfirmationModal;
