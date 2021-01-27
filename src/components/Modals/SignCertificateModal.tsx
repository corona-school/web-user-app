import React, { useRef, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Descriptions, Input } from 'antd';
import moment from 'moment';
import SignatureCanvas from 'react-signature-canvas';
import {
  ICertificateSignature,
  IExposedCertificate,
} from '../../types/Certificate';
import classes from './SignCertificateModal.module.scss';
import Button from '../button';
import { Title } from '../Typography';
import Icons from '../../assets/icons';

interface Props {
  certificate: IExposedCertificate;
  signCertificate: (
    certificate: IExposedCertificate,
    signature: ICertificateSignature
  ) => void;
  close();
}

const InfoPage: React.FC<Pick<Props, 'certificate'>> = ({ certificate }) => {
  return (
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
      <Descriptions.Item label="Medium">{certificate.medium}</Descriptions.Item>
    </Descriptions>
  );
};

interface SignPageProps {
  // eslint-disable-next-line
  signCanvas: React.MutableRefObject<any>;
  signatureLocation: string;
  setSignatureLocation: (string) => void;
  setIsSigned: (boolean) => void;
}

const SignPage: React.FC<SignPageProps> = ({
  signCanvas,
  signatureLocation,
  setSignatureLocation,
  setIsSigned,
}) => {
  return (
    <div className={classes.signPage}>
      <SignatureCanvas
        ref={(ref) => {
          // eslint-disable-next-line
          signCanvas.current = ref;
        }}
        onEnd={() => setIsSigned(!signCanvas.current.isEmpty())}
      />
      <Input
        value={signatureLocation}
        onChange={(e) => setSignatureLocation(e.target.value)}
        placeholder="Stadt"
        addonAfter={`, den ${moment().format('DD.MM.YY')}`}
        bordered={false}
      />
    </div>
  );
};

const SignCertificateModal: React.FC<Props> = ({
  certificate,
  signCertificate,
  close,
}) => {
  const [currentStep, setCurrentStep] = useState<'info' | 'sign'>('info');
  // eslint-disable-next-line
  const signCanvas = useRef<any>(); // https://www.npmjs.com/package/react-signature-canvas
  const [signatureLocation, setSignatureLocation] = useState('');
  const [isSigned, setIsSigned] = useState(false);

  function prepareSignature() {
    const signatureBase64 = signCanvas.current.toDataURL('image/png', 1.0);

    const signature = {
      signatureParent: undefined,
      signaturePupil: signatureBase64,
      signatureLocation,
    };
    console.log(signature);
    signCertificate(certificate, signature);
  }

  function discardSignature() {
    signCanvas.current.clear();
    setIsSigned(false);
  }

  function isInputValid() {
    return signatureLocation?.trim() !== '' && isSigned;
  }

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
          {currentStep === 'info' && <InfoPage certificate={certificate} />}
          {currentStep === 'sign' && (
            <SignPage
              signCanvas={signCanvas}
              signatureLocation={signatureLocation}
              setSignatureLocation={setSignatureLocation}
              setIsSigned={setIsSigned}
            />
          )}
        </div>
        <div className={classes.buttonContainer}>
          {currentStep === 'info' && (
            <Button
              backgroundColor="#F4F6FF"
              color="#4E6AE6"
              onClick={() => setCurrentStep('sign')}
            >
              Informationen bestätigen
            </Button>
          )}
          {currentStep === 'sign' && (
            <>
              <Button
                backgroundColor="#F4F6FF"
                color="#4E6AE6"
                onClick={() => setCurrentStep('info')}
              >
                Zurück
              </Button>
              <Button
                disabled={!isInputValid()}
                backgroundColor="#F4F6FF"
                color="#4E6AE6"
                onClick={() => prepareSignature()}
              >
                Abschicken
              </Button>
              <Button
                backgroundColor="#F4F6FF"
                color="#4E6AE6"
                onClick={() => discardSignature()}
              >
                <Icons.Delete />
              </Button>
            </>
          )}
        </div>
      </div>
    </StyledReactModal>
  );
};

export default SignCertificateModal;
