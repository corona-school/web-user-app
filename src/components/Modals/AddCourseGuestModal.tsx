import React, { useContext, useState } from 'react';
import { message } from 'antd';
import DialogModalBase from './DialogModalBase';
import { ReactComponent as AddIcon } from '../../assets/icons/plus-solid.svg';
import Context from '../../context';
import { ModalContext } from '../../context/ModalContext';

const accentColor = '#009d41';
const emailValidationRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AddCourseGuestModal: React.FC<{
  courseId: number;
}> = ({ courseId }) => {
  const [email, setEmail] = useState(null);
  const [firstname, setFirstname] = useState<string>(null);
  const [lastname, setLastname] = useState<string>(null);
  const [
    validationProblemDescription,
    setValidationProblemDescription,
  ] = useState<string>(null);

  const apiContext = useContext(Context.Api);
  const modalContext = useContext(ModalContext);

  const closeModal = () => {
    setEmail(null);
    setFirstname(null);
    setLastname(null);
    setValidationProblemDescription(null);
    modalContext.setOpenedModal(null);
  };

  const submit = () => {
    if (!emailValidationRegex.test(email)) {
      setValidationProblemDescription(
        'Die eingegebene E-Mail-Adresse ist ungültig.'
      );
      return;
    }
    if (!firstname?.length || !lastname?.length) {
      setValidationProblemDescription(
        'Vor- und Nachname dürfen nicht leer bleiben.'
      );
      return;
    }
    setValidationProblemDescription(null);
    apiContext.inviteCourseGuest(courseId, email, firstname, lastname).then(
      () => {
        message.success('Gäst*in wurde eingeladen!');
        closeModal();
      },
      (err) => {
        if (err.response != null && err.response.status != null) {
          if (err.response.status === 409) {
            message.error('Diese Person ist bereits Gäst*in deines Kurses.');
            console.log(err);
            return;
          }
          if (err.response.status === 429) {
            message.error(
              `Du kannst keine weitere Person mehr als Gäst*in einladen. Maximal 10 Personen dürfen eingeladen werden!`
            );
            console.log(err);
            return;
          }
        }
        message.error('Gäst*in konnte nicht eingeladen werden.');
        console.log(err);
      }
    );
  };

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="addCourseGuestModal">
        <DialogModalBase.Header>
          <DialogModalBase.Icon Icon={AddIcon} />
          <DialogModalBase.Title>Gäst*in hinzufügen</DialogModalBase.Title>
          <DialogModalBase.CloseButton
            stateSettingMethods={[
              setEmail,
              setFirstname,
              setLastname,
              validationProblemDescription,
            ]}
          />
        </DialogModalBase.Header>
        <div>
          {validationProblemDescription && (
            <DialogModalBase.Error>
              <span>{validationProblemDescription}</span>
            </DialogModalBase.Error>
          )}
          <DialogModalBase.Description>
            Hier hast du die Möglichkeit, bis zu fünf Gäst*innen zu deinem Kurs
            einzuladen. Nachdem du ihre Daten eingegeben hast, erhalten sie eine
            E-Mail mit einem Link über den sie später direkt dem Videochat
            beitreten können.
          </DialogModalBase.Description>

          <DialogModalBase.Content>
            <DialogModalBase.Form>
              <DialogModalBase.TextBox
                label="E-Mail-Adresse des/der Gäst*in"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <DialogModalBase.TextBox
                label="Vorname des/der Gäst*in"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
              />
              <DialogModalBase.TextBox
                label="Nachname des/der Gäst*in"
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
              />
              <DialogModalBase.Spacer />
              <DialogModalBase.ButtonBox>
                <DialogModalBase.Button label="Einladen" onClick={submit} />
              </DialogModalBase.ButtonBox>
            </DialogModalBase.Form>
          </DialogModalBase.Content>
        </div>
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default AddCourseGuestModal;
