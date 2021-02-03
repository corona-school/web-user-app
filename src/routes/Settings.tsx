import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Context from '../context';

import SubjectCard, { AddSubjectCard } from '../components/cards/SubjectCard';
import { ScreeningStatus } from '../types';
import SettingsCard from '../components/cards/SettingsCard';
import { Title } from '../components/Typography';

import classes from './Settings.module.scss';
import AccountNotScreenedModal from '../components/Modals/AccountNotScreenedModal';
import ProjectFieldCard, {
  AddProjectFieldCard,
} from '../components/cards/ProjectFieldCard';

import { JufoExpertCard } from '../components/cards/JufoExpertCard';

import { useAPI, useAPIResult } from '../context/ApiContext';
import {
  ICertificateSignature,
  IExposedCertificate,
  ISupportedLanguage,
} from '../types/Certificate';

import SignCertificateModal from '../components/Modals/SignCertificateModal';
import CertificateCard from '../components/cards/CertificateCard';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 !important;
`;

const Settings: React.FC = () => {
  const modalContext = useContext(Context.Modal);
  const userContext = useContext(Context.User);
  const [certificates, reloadCertificates] = useAPIResult('getCertificates');
  const [certificateToSign, setCertificateToSign] = useState<
    IExposedCertificate
  >();
  const getCertificate = useAPI('getCertificate');

  const signCertificateAPI = useAPI('signCertificate');

  console.log(certificates);

  async function signCertificate(
    certificate: IExposedCertificate,
    signature: ICertificateSignature
  ) {
    const success = await signCertificateAPI(certificate.uuid, signature);
    if (!success)
      alert(
        'An error occured while signing certificates. Please contact our support.'
      ); // TODO: Show error popup

    reloadCertificates();
  }

  async function showCertificate(
    certificate: IExposedCertificate,
    language: ISupportedLanguage
  ) {
    const response = await getCertificate(certificate.uuid, language);
    window.open(
      URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
    );
  }

  const { setOpenedModal } = modalContext;

  useEffect(() => {
    if (
      (userContext.user.isTutor &&
        userContext.user.screeningStatus === ScreeningStatus.Unscreened) ||
      (userContext.user.isInstructor &&
        userContext.user.instructorScreeningStatus ===
          ScreeningStatus.Unscreened) ||
      (userContext.user.isProjectCoach &&
        userContext.user.projectCoachingScreeningStatus ===
          ScreeningStatus.Unscreened)
    ) {
      setOpenedModal('accountNotScreened');
    }
  }, [
    setOpenedModal,
    userContext.user.isTutor,
    userContext.user.instructorScreeningStatus,
    userContext.user.isInstructor,
    userContext.user.screeningStatus,
    userContext.user.isProjectCoach,
    userContext.user.projectCoachingScreeningStatus,
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

  const renderProjectFields = () => {
    return (
      <>
        <Title size="h3" className={classes.subjectTitle}>
          Deine Projektbereiche
        </Title>
        <div>
          <Wrapper>
            {userContext.user.projectFields.map((projectInformation) => (
              <ProjectFieldCard
                key={projectInformation.name}
                type={userContext.user.type === 'student' ? 'coach' : 'coachee'}
                field={projectInformation}
              />
            ))}
            <AddProjectFieldCard
              type={userContext.user.type === 'student' ? 'coach' : 'coachee'}
              projectFields={userContext.user.projectFields.map((p) => p.name)}
            />
          </Wrapper>
        </div>
      </>
    );
  };

  const renderCertificatesTable = () => {
    if (!certificates.value?.length) return null;

    return (
      <>
        <Title size="h3" className={classes.subjectTitle}>
          Deine Zertifikate
        </Title>
        <Wrapper>
          {certificates.value?.map((certificate) => (
            <CertificateCard
              certificate={certificate}
              showCertificate={showCertificate}
              startSigning={setCertificateToSign}
            />
          ))}
        </Wrapper>
      </>
    );
  };

  return (
    <div className={classes.container}>
      <Title>Deine Informationen</Title>

      <SettingsCard
        user={userContext.user}
        reloadCertificates={reloadCertificates}
      />

      <JufoExpertCard />

      {(userContext.user.isTutor || userContext.user.isPupil) &&
        renderSubjects()}

      {(userContext.user.isProjectCoach || userContext.user.isProjectCoachee) &&
        renderProjectFields()}
      {renderCertificatesTable()}
      <AccountNotScreenedModal />
      {certificateToSign && (
        <SignCertificateModal
          certificate={certificateToSign}
          signCertificate={signCertificate}
          close={() => setCertificateToSign(undefined)}
        />
      )}
    </div>
  );
};

export default Settings;
