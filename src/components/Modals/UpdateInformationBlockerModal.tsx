import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Input, message } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import moment from 'moment';
import { Title, Text } from '../Typography';
import Button from '../button';
import { ModalContext } from '../../context/ModalContext';
import EditableUserSettingsCard, {
  EditableUserSettings,
} from '../cards/EditableUserSettingsCard';
import { ApiContext } from '../../context/ApiContext';
import { UserContext } from '../../context/UserContext';
import { User } from '../../types';

import classes from './UpdateInformationBlockerModal.module.scss';

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
    <StyledReactModal
      isOpen={modalContext.openedModal === MODAL_IDENTIFIER}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">{MODAL_TITLE}</Title>
        <Text large>
          Bitte aktualisiere deine Informationen, damit wir dir am besten
          weiterhelfen können!
        </Text>
        <EditableUserSettingsCard
          editableUserSettings={editableUserSettings}
          onSettingChanges={setEditableUserSettings}
          isEditing
          personType={user.type === 'pupil' ? 'tutee' : 'tutor'}
        />
        <div className={classes.buttonContainer}>
          <Button
            backgroundColor="#F4F6FF"
            color="#4E6AE6"
            onClick={saveUserChanges}
          >
            Speichern
          </Button>
        </div>
      </div>
    </StyledReactModal>
  );
};

export default UpdateInformationBlockerModal;
