import React, { useContext } from 'react';
import styled from 'styled-components';
import StyledReactModal, { ModalProps } from 'styled-react-modal';
import { ModalContext } from '../../context/ModalContext';
import Icons from '../../assets/icons';

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 15px 45px 15px 30px;
  position: relative;
  width: 663px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  max-height: 70vh;
  overflow-y: auto;

  > .title {
    font-size: 36px;
    line-height: 54px;
  }

  > .subtitle {
    font-style: italic;
    font-size: 14px;
    line-height: 21px;
    color: ${(props) => props.theme.color.gray2};
    /* margin-bottom: 35px; */
  }
`;

const CloseButton = styled.button`
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 15px;
  top: 15px;
`;

const Modal: React.FC<
  Omit<ModalProps, 'isOpen'> & {
    identifier: string;
    title?: string;
    subtitle?: string;
  }
> = ({ children, identifier, title, subtitle, ...props }) => {
  const modalContext = useContext(ModalContext);
  return (
    <StyledReactModal
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      isOpen={modalContext.openedModal === identifier}
    >
      <ModalWrapper>
        <CloseButton onClick={() => modalContext.setOpenedModal(null)}>
          <Icons.Close style={{ fill: 'red' }} />
        </CloseButton>
        {title && <span className="title">{title}</span>}
        {subtitle && <span className="subtitle">{subtitle}</span>}
        {children}
      </ModalWrapper>
    </StyledReactModal>
  );
};

export default Modal;
