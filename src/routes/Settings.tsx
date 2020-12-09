import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Select, Space, Table, Tag } from 'antd';
import Context from '../context';

import SubjectCard, { AddSubjectCard } from '../components/cards/SubjectCard';
import { ScreeningStatus } from '../types';
import SettingsCard from '../components/cards/SettingsCard';
import { Title } from '../components/Typography';

import classes from './Settings.module.scss';
import AccountNotScreenedModal from '../components/Modals/AccountNotScreenedModal';
import { isProjectCoachButNotTutor } from '../utils/UserUtils';
import ProjectFieldCard, {
  AddProjectFieldCard,
} from '../components/cards/ProjectFieldCard';
import { useAPI, useAPIResult } from '../context/ApiContext';
import {
  defaultLanguage,
  IExposedCertificate,
  ISupportedLanguage,
  supportedLanguages,
} from '../types/Certificate';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 !important;
`;

const Settings: React.FC = () => {
  const modalContext = useContext(Context.Modal);
  const userContext = useContext(Context.User);
  const certificates = useAPIResult('getCertificates');
  const getCertificate = useAPI('getCertificate');
  const [language, setLanguage] = useState<ISupportedLanguage>(defaultLanguage);

  async function showCertificate(uuid: IExposedCertificate['uuid']) {
    const response = await getCertificate(uuid, language);
    window.location.href = URL.createObjectURL(new Blob([response.data]));
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

  const stateTranslation: { [key in IExposedCertificate['state']]: string } = {
    manual: 'Manuell',
    'awaiting-approval': 'Auf Bestätigung warten',
    approved: 'Bestätigt',
  };

  const renderCertificatesTable = () => {
    const columns = [
      {
        title: 'Schüler*in',
        key: 'pupil',
        render: (certificate: IExposedCertificate) =>
          `${certificate.pupil.firstname} ${certificate.pupil.lastname}`,
      },
      {
        title: 'Student*in',
        key: 'student',
        render: (certificate: IExposedCertificate) =>
          `${certificate.student.firstname} ${certificate.student.lastname}`,
      },
      {
        title: 'Fächer',
        key: 'subjects',
        render: (certificate: IExposedCertificate) => (
          <>
            {certificate.subjects.split(', ').map((subject) => (
              <Tag key={subject}>{subject.toUpperCase()}</Tag>
            ))}
          </>
        ),
      },
      {
        title: 'Status',
        key: 'status',
        render: (certificate: IExposedCertificate) => (
          <>
            <Tag
              color={
                certificate.state === 'awaiting-approval' ? 'red' : 'green'
              }
              key={certificate.state}
            >
              {stateTranslation[certificate.state]}
            </Tag>
          </>
        ),
      },
      {
        title: 'Aktion',
        key: 'action',
        render: (certificate: IExposedCertificate) => (
          <Space size="middle">
            {userContext.user.isTutor && certificate.state === 'approved' && (
              <Button
                type="primary"
                onClick={() => showCertificate(certificate.uuid)}
              >
                Ansehen
              </Button>
            )}
            <Select
              defaultValue={defaultLanguage}
              onChange={(event) => setLanguage(event)}
              style={{ width: 120 }}
            >
              {Object.entries(supportedLanguages).map(([code, value]) => (
                <Select.Option value={code}>{value}</Select.Option>
              ))}
            </Select>
            {/* <Button danger>Löschen</Button> */}
          </Space>
        ),
      },
    ];

    return (
      <>
        <Title size="h3" className={classes.subjectTitle}>
          Zertifikate
        </Title>
        <Table dataSource={certificates.value ?? []} columns={columns} />
      </>
    );
  };

  return (
    <div className={classes.container}>
      <Title>Deine Informationen</Title>
      <SettingsCard user={userContext.user} />
      {!isProjectCoachButNotTutor(userContext.user) && renderSubjects()}
      {(userContext.user.isProjectCoach || userContext.user.isProjectCoachee) &&
        renderProjectFields()}
      {renderCertificatesTable()}
      <AccountNotScreenedModal />
    </div>
  );
};

export default Settings;
