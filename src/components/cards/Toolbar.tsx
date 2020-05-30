import React, { useContext } from 'react';
import styled from 'styled-components';
import { OldButton, OldLinkButton } from '../button';
import Icons from '../../assets/icons';
import Context from '../../context';
import { ScreeningStatus } from '../../types';

const OuterWrapper = styled.div`
  width: 536px;
  height: 147px;

  align-self: center;
  align-items: center;
  display: flex;
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  width: 436px;
  height: 67px;
`;

const Toolbar = () => {
  const userContext = useContext(Context.User);
  const modalContext = useContext(Context.Modal);
  return (
    <OuterWrapper>
      <InnerWrapper>
        {/* <Button icon={<Icons.Edit />} label="Bearbeiten" /> */}
        {userContext.user.screeningStatus === ScreeningStatus.Unscreened && (
          <OldLinkButton
            target="_blank"
            text="Authentifizieren"
            href="https://authentication.corona-school.de"
          ></OldLinkButton>
        )}
        <OldButton
          icon={<Icons.Delete />}
          text="Deaktivieren"
          onClick={() => modalContext.setOpenedModal('deactivateAccount')}
        />
      </InnerWrapper>
    </OuterWrapper>
  );
};

export default Toolbar;
