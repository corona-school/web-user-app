import React, { useContext } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import Icons from '../../assets/icons';
import Context from '../../context';

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
  const modalContext = useContext(Context.Modal);
  return (
    <OuterWrapper>
      <InnerWrapper>
        {/* <Button icon={<Icons.Edit />} label="Bearbeiten" /> */}
        <Button
          icon={<Icons.Delete />}
          text="Deaktivieren"
          onClick={() => modalContext.setOpenedModal('deactivateAccount')}
        />
      </InnerWrapper>
    </OuterWrapper>
  );
};

export default Toolbar;
