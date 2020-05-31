import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import StyledReactModal from 'styled-react-modal';
import Article from '../components/Article';
import Context from '../context';
import SettingsPersonalCard from '../components/cards/SettingsPersonalCard';
import SubjectCard, { AddSubjectCard } from '../components/cards/SubjectCard';
import Button, { ButtonDestructive, LinkButton } from '../components/button';
import Icons from '../assets/icons';
import { ScreeningStatus } from '../types';
import { Text, Title } from '../components/Typography';
import Images from '../assets/images';

import classes from './Settings.module.scss';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 !important;
`;

const ModalDeactivateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 690px;
  height: 336px;
  background: #ffffff;
  border-radius: 4px;
  padding: 30px;
  position: relative;

  span {
    font-size: 36px;
    line-height: 54px;
    letter-spacing: -0.333333px;
    color: ${(props) => props.theme.colorScheme.black};
  }

  small {
    font-size: 18px;
    line-height: 27px !important;
    letter-spacing: -0.333333px;
    color: ${(props) => props.theme.colorScheme.gray2};
  }
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
  const apiContext = useContext(Context.Api);
  const modalContext = useContext(Context.Modal);
  const userContext = useContext(Context.User);

  useEffect(() => {
    if (userContext.user.screeningStatus === ScreeningStatus.Unscreened) {
      modalContext.setOpenedModal('accountNotScreened');
    }
  }, [userContext.user.screeningStatus]);

  return (
    <>
      <Article title="Deine Informationen" cardDirection="row">
        <SettingsPersonalCard user={userContext.user} />
      </Article>
      <Article title="Deine Fächer" cardDirection="row">
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
      </Article>
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
              href="https://authentication.corona-school.de"
            >
              Kennenlernen
            </LinkButton>
          </div>
          <CloseButtonStyle onClick={() => modalContext.setOpenedModal(null)}>
            <Icons.Close />
          </CloseButtonStyle>
        </div>
      </StyledReactModal>
      <StyledReactModal
        isOpen={modalContext.openedModal === 'deactivateAccount'}
      >
        <ModalDeactivateWrapper>
          <span>Account deaktivieren</span>
          <br />
          <small>
            Schade, dass du die Corona School verlassen möchtest. Sobald du
            deinen Account deaktivierst, werden deine aktuellen Zuordnungen
            aufgelöst und deine Lernpartner*innen darüber informiert. Falls du
            zu einem späteren Zeitpunkt wieder Teil der Corona School werden
            möchtest, kannst du dich jederzeit wieder bei uns melden.
          </small>
          <br />
          <ButtonDestructive
            onClick={() =>
              apiContext
                .putUserActiveFalse()
                .then(() => window.location.assign('https://corona-school.de/'))
            }
          >
            Account endgültig deaktivieren
          </ButtonDestructive>
          <CloseButtonStyle onClick={() => modalContext.setOpenedModal(null)}>
            <Icons.Close />
          </CloseButtonStyle>
        </ModalDeactivateWrapper>
      </StyledReactModal>
    </>
  );
};

export default Settings;
