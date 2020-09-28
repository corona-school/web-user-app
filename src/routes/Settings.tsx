import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import Context from '../context';

import SubjectCard, { AddSubjectCard } from '../components/cards/SubjectCard';
import { ScreeningStatus } from '../types';
import SettingsCard from '../components/cards/SettingsCard';
import { Title } from '../components/Typography';

import classes from './Settings.module.scss';
import AccountNotScreenedModal from '../components/Modals/AccountNotScreenedModal';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 !important;
`;

const Settings: React.FC = () => {
  const modalContext = useContext(Context.Modal);
  const userContext = useContext(Context.User);

  const { setOpenedModal } = modalContext;

  useEffect(() => {
    if (
      userContext.user.screeningStatus === ScreeningStatus.Unscreened ||
      (userContext.user.isInstructor &&
        userContext.user.instructorScreeningStatus ===
          ScreeningStatus.Unscreened)
    ) {
      setOpenedModal('accountNotScreened');
    }
  }, [
    setOpenedModal,
    userContext.user.instructorScreeningStatus,
    userContext.user.isInstructor,
    userContext.user.screeningStatus,
  ]);

  const renderSubjects = () => {
    return (
      <>
        <Title size="h3" className={classes.subjectTitle}>
          Deine Fächer
        </Title>
        <div>
          <Wrapper>
            {userContext.user.subjects.map((subject) => (
              <SubjectCard
                key={subject.name}
                subject={subject}
                type={userContext.user.type}
              />
            ))}
            <AddSubjectCard
              type={userContext.user.type}
              subjects={userContext.user.subjects.map((s) => s.name)}
            />
          </Wrapper>
        </div>
      </>
    );
  };

  return (
    <div className={classes.container}>
      <Title>Deine Informationen</Title>
      <SettingsCard user={userContext.user} />
      {renderSubjects()}
      <AccountNotScreenedModal />
    </div>
  );
};

export default Settings;
