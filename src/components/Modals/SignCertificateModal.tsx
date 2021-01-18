import React, { useContext } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Descriptions } from 'antd';
import { IExposedCertificate } from '../../types/Certificate';
import context from '../../context';

interface Props {
  certificate: IExposedCertificate;
  signCertificate: () => void;
}

const SignCertificateModal: React.FC<Props> = () => {
  const modalContext = useContext(context.Modal);
  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'signCertificateModal'}
    >
      <Descriptions title="User Info" bordered>
        <Descriptions.Item label="Student">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="Duration">1.1. - 2.2.</Descriptions.Item>
      </Descriptions>
    </StyledReactModal>
  );
};

export default SignCertificateModal;
