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
  setIsSigned: (boolean) => void;
  isMinor: boolean;
}

interface LocationPageProps {
  signatureLocation: string;
  setSignatureLocation(location: string);
}

const LocationPage: React.FC<LocationPageProps> = ({
  signatureLocation,
  setSignatureLocation,
}) => {
  return (
    <>
      An welchem Ort unterschreibst du?
      <Input
        value={signatureLocation}
        onChange={(e) => setSignatureLocation(e.target.value)}
        placeholder="Stadt"
      />
    </>
  );
};

const SignPage: React.FC<SignPageProps> = ({
  signCanvas,
  signatureLocation,
  setIsSigned,
  isMinor,
}) => {
  const updateSigned = React.useCallback(
    () => setIsSigned(!signCanvas.current.isEmpty()),
    [setIsSigned, signCanvas]
  );
  // NOTE: Resizing the canvas causes it to be cleared.
  // This is still the better option than https://github.com/agilgur5/react-signature-canvas/issues/57
  // We need our own hook to detect when the canvas gets cleared, as the library does not provide one:
  React.useEffect(() => {
    window.addEventListener('resize', updateSigned);
    return () => window.removeEventListener('resize', updateSigned);
  }, [updateSigned]);

  return (
    <div className={classes.signPage}>
      <div>Unterschrift {isMinor ? 'Erziehungsberechtigter' : 'Schüler'}</div>
      <SignatureCanvas
        ref={(ref) => {
          // eslint-disable-next-line
          signCanvas.current = ref;
        }}
        onEnd={updateSigned}
      />
      <div>
        {signatureLocation}, den {moment().format('DD.MM.YY')}
      </div>
    </div>
  );
};

const SignCertificateModal: React.FC<Props> = ({
  certificate,
  signCertificate,
  close,
}) => {
  const [currentStep, setCurrentStepShadowed] = useState<
    'info' | 'warning' | 'location' | 'sign'
  >('info');
  // eslint-disable-next-line
  const signCanvas = useRef<any>(); // https://www.npmjs.com/package/react-signature-canvas
  const [signatureLocation, setSignatureLocation] = useState('');
  // NOTE: In some obscure cases (e.g. scaling the canvas) the canvas gets emptied and this state is invalid
  //       Always additionally check signCanvas.current.isEmpty()
  const [isSigned, setIsSigned] = useState(false);
  const [isMinor, setIsMinor] = useState(true);

  // Going back also resets the canvas
  function setCurrentStep(step: typeof currentStep) {
    setCurrentStepShadowed(step);
    setIsSigned(false);
  }

  function prepareSignature() {
    if (!isSigned || signCanvas.current.isEmpty()) return;

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
          {currentStep === 'location' && (
            <LocationPage
              signatureLocation={signatureLocation}
              setSignatureLocation={setSignatureLocation}
            />
          )}
          {currentStep === 'sign' && (
            <SignPage
              signCanvas={signCanvas}
              signatureLocation={signatureLocation}
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
                onClick={() => setCurrentStep('location')}
              >
                Weiter
              </Button>
            </>
          )}
          {currentStep === 'location' && (
            <>
              <Button
                backgroundColor="#F4F6FF"
                color="#4E6AE6"
                onClick={() => setCurrentStep('warning')}
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
                onClick={() => setCurrentStep('location')}
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
