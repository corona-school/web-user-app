import StyledReactModal from 'styled-react-modal';
import React, { useContext } from 'react';
import styled from 'styled-components';
import classes from './AccountNotScreenedModal.module.scss';
import Images from '../../assets/images';
import { Text, Title } from '../Typography';
import Button, { LinkButton } from '../button';
import Icons from '../../assets/icons';
import Context from '../../context';

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

const AccountNotScreenedModal = () => {
  const modalContext = useContext(Context.Modal);
  const userContext = useContext(Context.User);

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'accountNotScreened'}
    >
      <div className={classes.screeningModalContainer}>
        <Images.LetUsMeetIllustration width="400px" height="300px" />
        <Title size="h2" className={classes.title}>
          Lern uns kennen!
        </Title>
        <Text className={classes.text}>
          Wir möchten dich gerne persönlich kennenlernen und zu einem Gespräch
          einladen, in welchem du auch deine Fragen loswerden kannst.
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
  );
};

export default AccountNotScreenedModal;
