import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { message } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import moment from 'moment';
import { Title } from '../Typography';
import { ModalContext } from '../../context/ModalContext';
import EditableUserSettingsCard, {
  EditableUserSettings,
} from '../cards/EditableUserSettingsCard';
import { ApiContext } from '../../context/ApiContext';
import { UserContext } from '../../context/UserContext';
import { User } from '../../types';

import classes from './UpdateInformationBlockerModal.module.scss';
import DialogModalBase from './DialogModalBase';

export const MODAL_IDENTIFIER = 'updateInformationBlocker';
const MODAL_TITLE = 'Bitte aktualisiere deine Informationen zum Schulstart';

interface Props {
  user: User;
}

const UpdateInformationBlockerModal: React.FC<Props> = ({ user }) => {
  const [editableUserSettings, setEditableUserSettings] = useState<
    EditableUserSettings
  >({
    state: user.state,
    grade: user.grade,
    schoolType: user.schoolType,
    university: user.university,
  });
  const [isSaving, setIsSaving] = useState(false);

  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const saveUserChanges = async () => {
    setIsSaving(true);

    try {
      await api.putUser({
        ...user,
        ...editableUserSettings,
        lastUpdatedSettingsViaBlocker: moment().unix(),
      });
      modalContext.setOpenedModal(null);
      userContext.fetchUserData();
    } catch {
      message.error('Ein Fehler ist aufgetreten. Probiere es noch einmal!');
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return (
      <StyledReactModal isOpen={modalContext.openedModal === MODAL_IDENTIFIER}>
        <div className={classes.modal}>
          <Title size="h2">Wir aktualisieren deine Informationen...</Title>
          <ClipLoader size={100} color="#123abc" loading />
        </div>
      </StyledReactModal>
    );
  }
  return (
    <DialogModalBase accentColor="#54841d">
      <DialogModalBase.Modal modalName={MODAL_IDENTIFIER}>
        <DialogModalBase.Header>
          <DialogModalBase.Title>{MODAL_TITLE}</DialogModalBase.Title>
          <DialogModalBase.CloseButton />
        </DialogModalBase.Header>
        <DialogModalBase.Description>
          Bitte aktualisiere deine Informationen, damit wir dir am besten
          weiterhelfen können!
        </DialogModalBase.Description>
        <EditableUserSettingsCard
          editableUserSettings={editableUserSettings}
          onSettingChanges={setEditableUserSettings}
          isEditing
          personType={user.type === 'pupil' ? 'tutee' : 'tutor'}
        />
        <DialogModalBase.Button label="Speichern" onClick={saveUserChanges} />
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};

export default UpdateInformationBlockerModal;
