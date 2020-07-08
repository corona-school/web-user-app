import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import StyledReactModal from 'styled-react-modal';
import Context from '../context';

import SubjectCard, { AddSubjectCard } from '../components/cards/SubjectCard';
import Button, { LinkButton } from '../components/button';
import Icons from '../assets/icons';
import { ScreeningStatus } from '../types';
import SettingsCard from '../components/cards/SettingsCard';
import { Text, Title } from '../components/Typography';
import Images from '../assets/images';

import classes from './Settings.module.scss';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 !important;
`;

const CloseButtonStyle = styled.button`
  position: absolute;
  width: 39.02px;
  height: 40px;
  right: 0;
  top: 0;

  > * {
    position: absolute;
    width: 24px;
    height: 24px;
    left: 0px;
    top: 8px;
  }
`;

const Settings: React.FC = () => {
  const modalContext = useContext(Context.Modal);
  const userContext = useContext(Context.User);

  useEffect(() => {
    if (
      userContext.user.screeningStatus === ScreeningStatus.Unscreened ||
      (userContext.user.isInstructor &&
        userContext.user.instructorScreeningStatus ===
          ScreeningStatus.Unscreened)
    ) {
      modalContext.setOpenedModal('accountNotScreened');
    }
  }, [userContext.user.screeningStatus]);

  return (
    <div className={classes.container}>
      <Title>Deine Informationen</Title>
      <SettingsCard user={userContext.user} />

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
      <StyledReactModal
        isOpen={modalContext.openedModal === 'accountNotScreened'}
      >
        <div className={classes.screeningModalContainer}>
          <Images.LetUsMeetIllustration width="400px" height="300px" />
          <Title size="h2" className={classes.title}>
            Lern uns kennen!
          </Title>
          <Text className={classes.text}>
            Wir möchten dich gerne persönlich kennenlernen und zu einem
            digitalen Gespräch einladen, in welchem du auch deine Fragen
            loswerden kannst.
          </Text>
          <div className={classes.buttonContainer}>
            <Button
              backgroundColor="#EDEDED"
              color="#6E6E6E"
              onClick={() => modalContext.setOpenedModal(null)}
            >
              Später
            </Button>
            <LinkButton
              backgroundColor="#FFF7DB"
              color="#FFCC12"
              target="_blank"
              href={
                userContext.user.isInstructor
                  ? `https://go.oncehub.com/CourseReview?name=${encodeURI(
                      userContext.user.firstname + userContext.user.lastname
                    )}&email=${encodeURI(userContext.user.email)}&skip=1`
                  : 'https://authentication.corona-school.de'
              }
            >
              Kennenlernen
            </LinkButton>
          </div>
          <CloseButtonStyle onClick={() => modalContext.setOpenedModal(null)}>
            <Icons.Close />
          </CloseButtonStyle>
        </div>
      </StyledReactModal>
    </div>
  );
};

export default Settings;
