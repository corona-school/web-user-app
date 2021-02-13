import React, { useRef, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Descriptions, Input, Radio } from 'antd';
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

interface WarningPageProps {
  isMinor: boolean;
  setIsMinor: (boolean) => void;
}

const WarningPage: React.FC<WarningPageProps> = ({ isMinor, setIsMinor }) => {
  return (
    <>
      <div>
        Achtung! Solltest Du nicht volljährig sein, muss ein
        Erziehungsberechtigter unterschreiben.
      </div>
      <div>Ich bin:</div>
      <Radio.Group
        onChange={(e) => setIsMinor(e.target.value === 1)}
        value={isMinor ? 1 : 2}
      >
        <Radio value={1}>Minderjährig</Radio>
        <Radio value={2}>{'Volljährig (> 18 Jahre)'}</Radio>
      </Radio.Group>
    </>
  );
};

interface SignPageProps {
  // eslint-disable-next-line
  signCanvas: React.MutableRefObject<any>;
  signatureLocation: string;
  setSignatureLocation: (string) => void;
  setIsSigned: (boolean) => void;
  isMinor: boolean;
}

const SignPage: React.FC<SignPageProps> = ({
  signCanvas,
  signatureLocation,
  setSignatureLocation,
  setIsSigned,
  isMinor,
}) => {
  return (
    <div className={classes.signPage}>
      <div>Unterschrift {isMinor ? 'Erziehungsberechtigter' : 'Schüler'}</div>
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
  const [currentStep, setCurrentStep] = useState<'info' | 'warning' | 'sign'>(
    'info'
  );
  // eslint-disable-next-line
  const signCanvas = useRef<any>(); // https://www.npmjs.com/package/react-signature-canvas
  const [signatureLocation, setSignatureLocation] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isMinor, setIsMinor] = useState(true);

  function prepareSignature() {
    const signatureBase64 = signCanvas.current.toDataURL('image/png', 1.0);

    const signature = {
      signatureParent: isMinor ? signatureBase64 : undefined,
      signaturePupil: !isMinor ? signatureBase64 : undefined,
      signatureLocation,
    };
    signCertificate(certificate, signature);
    close();
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
            <Title size="h2">Zertifikat genehmigen</Title>
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
          {currentStep === 'warning' && (
            <WarningPage isMinor={isMinor} setIsMinor={setIsMinor} />
          )}
          {currentStep === 'sign' && (
            <SignPage
              signCanvas={signCanvas}
              signatureLocation={signatureLocation}
              setSignatureLocation={setSignatureLocation}
              setIsSigned={setIsSigned}
              isMinor={isMinor}
            />
          )}
        </div>
        <div className={classes.buttonContainer}>
          {currentStep === 'info' && (
            <Button
              backgroundColor="#F4F6FF"
              color="#4E6AE6"
              onClick={() => setCurrentStep('warning')}
            >
              Informationen bestätigen
            </Button>
          )}
          {currentStep === 'warning' && (
            <>
              <Button
                backgroundColor="#F4F6FF"
                color="#4E6AE6"
                onClick={() => setCurrentStep('info')}
              >
                Zurück
              </Button>
              <Button
                backgroundColor="#F4F6FF"
                color="#4E6AE6"
                onClick={() => setCurrentStep('sign')}
              >
                Weiter
              </Button>
            </>
          )}
          {currentStep === 'sign' && (
            <>
              <Button
                backgroundColor="#F4F6FF"
                color="#4E6AE6"
                onClick={() => setCurrentStep('warning')}
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
                backgroundColor="rgb(244, 246, 255)"
                color="#FF0000"
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
