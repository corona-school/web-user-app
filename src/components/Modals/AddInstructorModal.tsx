import React, { useContext, useState } from 'react';
import { message } from 'antd';
import DialogModalBase from './DialogModalBase';
import { ReactComponent as AddIcon } from '../../assets/icons/plus-solid.svg';
import Context from '../../context';
import { ModalContext } from '../../context/ModalContext';

const accentColor = '#009d41';
const emailValidationRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AddInstructorModal: React.FC<{
  courseId: number;
  updateDetails: () => void;
}> = ({ courseId, updateDetails }) => {
  const [email, setEmail] = useState(null);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const apiContext = useContext(Context.Api);
  const modalContext = useContext(ModalContext);

  const closeModal = () => {
    setEmail(null);
    setEmailInvalid(false);
    modalContext.setOpenedModal(null);
  };

  const submit = () => {
    if (!emailValidationRegex.test(email)) {
      setEmailInvalid(true);
      return;
    }
    setEmailInvalid(false);
    apiContext.addInstructor(courseId, email).then(
      () => {
        message.success('Tutor*in wurde hinzugefügt!');
        closeModal();
        updateDetails();
      },
      (err) => {
        if (err.response != null && err.response.status != null) {
          if (err.response.status === 409) {
            message.error('Diese Person ist bereits Tutor*in des Kurses.');
            console.log(err);
            return;
          }
          if (err.response.status === 404) {
            message.error(
              `Diese Person konnte nicht gefunden werden. ${email} muss sich zunächst auf der Plattform als Kursleiter*in registieren.`
            );
            console.log(err);
            return;
          }
        }
        message.error('Tutor*in konnte nicht hinzugefügt werden.');
        console.log(err);
      }
    );
  };

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="addInstructorModal">
        <DialogModalBase.Header>
          <DialogModalBase.Icon Icon={AddIcon} />
          <DialogModalBase.Title>Tutor*in hinzufügen</DialogModalBase.Title>
          <DialogModalBase.CloseButton
            stateSettingMethods={[setEmail, setEmailInvalid]}
          />
        </DialogModalBase.Header>
        <div>
          {emailInvalid && (
            <DialogModalBase.Error>
              <span>Die eingegebene E-Mail-Adresse ist ungültig.</span>
            </DialogModalBase.Error>
          )}
          <DialogModalBase.Description>
            Lorem ipsum dolor sit amet, lorem ipsum, lorem ipsum.....
          </DialogModalBase.Description>

          <DialogModalBase.Content>
            <DialogModalBase.Form>
              <DialogModalBase.TextBox
                label="E-Mail-Adresse des/der Tutor*in"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <DialogModalBase.Spacer />
              <DialogModalBase.ButtonBox>
                <DialogModalBase.Button label="Hinzufügen" onClick={submit} />
              </DialogModalBase.ButtonBox>
            </DialogModalBase.Form>
          </DialogModalBase.Content>
        </div>
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default AddInstructorModal;
