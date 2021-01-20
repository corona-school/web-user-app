import React from 'react';
import StyledReactModal from 'styled-react-modal';
import { Descriptions } from 'antd';
import { IExposedCertificate } from '../../types/Certificate';

interface Props {
  certificate: IExposedCertificate;
  signCertificate: (uuid: string) => void;
  close();
}

const SignCertificateModal: React.FC<Props> = () => {
  return (
    <StyledReactModal isOpen>
      <Descriptions title="User Info" bordered>
        <Descriptions.Item label="Student">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="Duration">1.1. - 2.2.</Descriptions.Item>
      </Descriptions>
    </StyledReactModal>
  );
};

export default SignCertificateModal;
