import React, { useContext, useEffect, useState } from 'react';
import StyledReactModal from 'styled-react-modal';

import { message } from 'antd';
import { User } from '../../types';
import Icons from '../../assets/icons';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import CertificateModal from '../Modals/CerificateModal';
import { isProjectCoachButNotTutor, getUserTags } from '../../utils/UserUtils';
import { ReactComponent as Trashcan } from '../../assets/icons/trashcan.svg';
import { Tag } from '../Tag';
import context from '../../context';

import classes from './SettingsCard.module.scss';
import BecomeInstructorModal from '../Modals/BecomeInstructorModal';
import BecomeInternModal from '../Modals/BecomeInternModal';
import EditableUserSettingsCard, {
  EditableUserSettings,
} from './EditableUserSettingsCard';
import SaveEditButton from '../button/SaveEditButton';
import AccentColorButton from '../button/AccentColorButton';

interface Props {
  user: User;
  reloadCertificates: () => void;
}

const SettingsCard: React.FC<Props> = ({ user, reloadCertificates }) => {
  const modalContext = useContext(context.Modal);
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
  const [isSaving, setIsSaving] = useState(false);

  const saveUserChanges = async () => {
    try {
      setIsSaving(true);
      await ApiContext.putUser({ ...user, ...editableUserSettings });
      setIsSaving(false);
      setIsEditing(false);
    } catch {
      message.error('Ein Fehler ist aufgetreten. Probiere es noch einmal!');
    } finally {
      setIsSaving(false);
    }
  };

  const renderCourseButton = () => {
    if (user.type !== 'student') {
      return null;
    }

    if (isProjectCoachButNotTutor(user)) {
      return null;
    }

    if (user.isInstructor) {
      return null;
    }

    return (
      <>
        <AccentColorButton
          onClick={() => modalContext.setOpenedModal('startInternship')}
          accentColor="#4E6AE6"
          label="Praktikum anmelden"
          small
        />
        <AccentColorButton
          onClick={() => modalContext.setOpenedModal('becomeInstructor')}
          accentColor="#4E6AE6"
          label="Kursleiter*in werden"
          small
        />
      </>
    );
  };

  const userTags = getUserTags(user);

  return (
    <>
      <CardBase highlightColor="#F4486D" className={classes.baseContainer}>
        <div className={classes.container}>
          <div className={classes.matchInfoContainer}>
            <Title size="h4" bold>
              {user.firstname} {user.lastname}
            </Title>
            <Text className={classes.emailText} large>
              {user.email}
            </Text>
          </div>
          <div className={classes.tagContainer}>
            {userTags.map((tag) => (
              <Tag
                background="#4E555C"
                color="#ffffff"
                style={{ marginLeft: '10px' }}
              >
                {tag}
              </Tag>
            ))}
          </div>
          {user.isProjectCoach && (
            <div className={classes.subjectContainer}>
              <Text large>
                <b>Fachgebiete</b>
              </Text>
              <Text className={classes.emailText} large>
                {user.projectFields.map((s) => s.name).join(', ')}
              </Text>
            </div>
          )}
          {!isProjectCoachButNotTutor(user) && user.subjects.length > 0 && (
            <div className={classes.subjectContainer}>
              <Text large>
                <b>Fächer</b>
              </Text>
              <Text className={classes.emailText} large>
                {user.subjects.map((s) => s.name).join(', ')}
              </Text>
            </div>
          )}
          <EditableUserSettingsCard
            editableUserSettings={editableUserSettings}
            onSettingChanges={setEditableUserSettings}
            isEditing={isEditing}
            personType={user.type === 'pupil' ? 'tutee' : 'tutor'}
          />
          <div className={classes.mainButtonContainer}>
            {renderCourseButton()}

            {user.isTutor && (
              <AccentColorButton
                disabled={
                  user.matches.length + user.dissolvedMatches.length === 0
                }
                onClick={() => modalContext.setOpenedModal('certificateModal')}
                accentColor="#4E6AE6"
                label="Bescheinigung anfordern"
                small
              />
            )}
            <AccentColorButton
              onClick={() => modalContext.setOpenedModal('deactivateAccount')}
              accentColor="#6E6E6E"
              Icon={Trashcan}
              label="Deaktivieren"
              small
            />
            <SaveEditButton
              isEditing={isEditing}
              isLoading={isSaving}
              onEditChange={(nowEditing) => {
                if (!nowEditing) {
                  saveUserChanges();
                } else {
                  setIsEditing(nowEditing);
                }
              }}
            />
          </div>
        </div>
      </CardBase>
      <CertificateModal user={user} reloadCertificates={reloadCertificates} />
      <BecomeInstructorModal user={user} />
      <BecomeInternModal user={user} />
      <StyledReactModal
        isOpen={modalContext.openedModal === 'deactivateAccount'}
      >
        <div className={classes.modal}>
          <Title size="h2">Account deaktivieren</Title>
          <Text>
            Schade, dass du die Corona School verlassen möchtest. Sobald du
            deinen Account deaktivierst, werden deine aktuellen Zuordnungen
            aufgelöst und deine Lernpartner*innen darüber informiert. Falls du
            zu einem späteren Zeitpunkt wieder Teil der Corona School werden
            möchtest, kannst du dich jederzeit wieder bei uns melden.
          </Text>
          <div className={classes.buttonContainer}>
            <AccentColorButton
              accentColor="#6E6E6E"
              onClick={() => modalContext.setOpenedModal(null)}
              label="Abbrechen"
              Icon={Icons.Close}
            />
            <AccentColorButton
              accentColor="D03D53"
              onClick={() =>
                ApiContext.putUserActiveFalse().then(() =>
                  window.location.assign('https://corona-school.de/')
                )
              }
              label="Deaktivieren"
            />
          </div>
        </div>
      </StyledReactModal>
    </>
  );
};

export default SettingsCard;
