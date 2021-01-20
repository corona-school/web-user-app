import React from 'react';
import StyledReactModal from 'styled-react-modal';
import { Descriptions } from 'antd';
import moment from 'moment';
import { IExposedCertificate } from '../../types/Certificate';
import classes from './SignCertificateModal.module.scss';
import Button from '../button';
import { Title } from '../Typography';
import Icons from '../../assets/icons';

interface Props {
  certificate: IExposedCertificate;
  signCertificate: (uuid: string) => void;
  close();
}

const SignCertificateModal: React.FC<Props> = ({ certificate, close }) => {
  return (
    <StyledReactModal isOpen>
      <div className={classes.modal}>
        <div className={classes.stepContainer}>
          <div className={classes.titleBar}>
            <Title size="h2">Bescheinigung beantragen</Title>
            <Button
              color="#B5B5B5"
              backgroundColor="#ffffff"
              onClick={() => {
                close();
              }}
            >
              <Icons.Abort />
            </Button>
          </div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Student">
              {`${certificate.student.firstname} ${certificate.student.lastname}`}
            </Descriptions.Item>
            <Descriptions.Item label="Fächer">
              {certificate.subjects.split(',').join(', ')}
            </Descriptions.Item>
            <Descriptions.Item label="Beginn der Unterstützung">
              {moment(certificate.startDate).format('DD.MM.YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Ende der Unterstützung">
              {moment(certificate.endDate).format('DD.MM.YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Unterstützung pro Woche in Stunden">
              {certificate.hoursPerWeek}
            </Descriptions.Item>
            <Descriptions.Item label="Unterstützung gesamt">
              {certificate.hoursTotal}
            </Descriptions.Item>
            <Descriptions.Item label="Kategorie">
              {certificate.categories.split(/(?:\r\n|\r|\n)/g).map((cat) => (
                <>
                  {cat}.<br />
                </>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Medium">
              {certificate.medium}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </StyledReactModal>
  );
};

export default SignCertificateModal;
