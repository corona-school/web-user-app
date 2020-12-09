import React, { useContext, useState, useEffect } from 'react';
import StyledReactModal from 'styled-react-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { Select, DatePicker, InputNumber, message, Checkbox } from 'antd';
import moment from 'moment';

import context from '../../context';
import classes from './CertificateModal.module.scss';
import { Title, Text } from '../Typography';
import Button from '../button';
import Icons from '../../assets/icons';
import { User } from '../../types';
import ActivityForm from '../forms/ActivityForm';
import {
  defaultLanguage,
  ISupportedLanguage,
  supportedLanguages,
} from '../../types/Certificate';

const { Option } = Select;

interface Props {
  user: User;
}

const STEPS = 4;

export interface Activity {
  index: number;
  text: string;
}

export interface CertificateData {
  student?: string;
  endDate: number;
  weekCount: number;
  hoursPerWeek: number;
  hoursTotal: number;
  subjects: string[];
  mediaType: string | null;
  activities: string[];
  ongoingLessons: boolean;
  lang: ISupportedLanguage;
}

const CertificateModal: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<ISupportedLanguage>(defaultLanguage);
  const allMatches = [...user.matches, ...user.dissolvedMatches];

  const [certificateData, setCertificateData] = useState<CertificateData>({
    endDate: moment().unix(),
    weekCount: 0,
    hoursPerWeek: 1.0,
    hoursTotal: 0,
    subjects: [],
    mediaType: null,
    activities: [],
    ongoingLessons: false,
    lang: language,
  });

  const [currentStep, setStep] = useState(0);
  const modalContext = useContext(context.Modal);
  const apiContext = useContext(context.Api);

  useEffect(() => {
    const selectedPupil = allMatches.find(
      (s) => s.uuid === certificateData.student
    );
    if (selectedPupil) {
      const b = moment(new Date(selectedPupil.date), 'DD/MM/YYYY');
      const a = moment(new Date(certificateData.endDate * 1000), 'DD/MM/YYYY');

      const weekCount = a.diff(b, 'week');
      setCertificateData({
        ...certificateData,
        weekCount,
        hoursTotal: certificateData.hoursPerWeek * weekCount,
      });
    }
  }, [
    certificateData.hoursPerWeek,
    certificateData.endDate,
    certificateData.student,
  ]);

  const isWorkloadAllowedNumber = () => {
    return (
      certificateData.hoursPerWeek % 0.25 === 0 &&
      certificateData.hoursPerWeek >= 0.25 &&
      certificateData.hoursPerWeek <= 40.0
    );
  };

  const renderIntroduction = () => {
    return (
      <>
        <Text>
          Wir möchten uns für dein Engagement in der Corona School bedanken! Für
          deine Tätigkeit stellen wir dir gerne eine Bescheinigung aus, welche
          du bei einer Bewerbung beilegen oder bei deiner Universität einreichen
          kannst.
        </Text>
        <br />
        <Title size="h5" bold>
          Wie funktioniert’s?
        </Title>
        <Text>
          Unsere Bescheinigung besteht aus zwei Teilen, welche von
          unterschiedlichen Personen bestätigt werden. Der Corona School e.V.
          kann euch problemlos Folgendes bestätigen:
          <li>Registrierung auf unserer Plattform</li>
          <li>Durchlaufen eines Eignungsgesprächs</li>
          <li>Vermittlung an eine*n Schüler*in</li>
        </Text>
        <Text>
          Das Ausmaß und die genauen Inhalte der ehrenamtlichen Tätigkeit werden
          durch deine*n Schüler*in bestätigt. Um den Prozess so einfach wie
          möglich zu gestalten, kannst du auf der folgenden Seite
          <li>das zeitliche Ausmaß der ehrenamtlichen Tätigkeit</li>
          <li>die genauen Inhalte und Aufgaben der ehrenamtlichen Tätigkeit</li>
          angeben. Daraus erstellen wir dir ein fertiges PDF, welches du an
          deine*n Schüler*in zum Unterschreiben schicken kannst.
        </Text>
      </>
    );
  };

  const renderGeneralInformationForm = () => {
    const dateFormat = 'DD/MM/YYYY';
    const MediaTypes = ['Video-Chat', 'E-Mail', 'Telefon', 'Chat-Nachrichten'];

    if (allMatches.length === 0) {
      return (
        <div>
          <Title size="h2">Zertifikat erstellen</Title>
          <Text>Du hast keine Matches</Text>
        </div>
      );
    }

    const selectedPupil = allMatches.find(
      (s) => s.uuid === certificateData.student
    );

    return (
      <div className={classes.generalInformationContainer}>
        <Text className={classes.description}>
          Schritt 1: Allgemeine Informationen eintragen
        </Text>
        <Title size="h5" bold>
          Schüler*in
        </Title>
        <div className={classes.inputField}>
          <Select
            placeholder="Wähle deine*n Schüler*in"
            value={certificateData.student}
            onChange={(v) => {
              setCertificateData({
                ...certificateData,
                student: v,
                subjects: [],
                endDate: moment().unix(), // reset this, such that it does not get an invalid value (otherwise an invalid value for the end date may occur if the current certificateData.endDate value from a previously selected pupil is no longer valid for the now selected pupil because certificateData.endDate was a date before the match with the now selected pupil was created)
              });
            }}
            style={{ width: '200px' }}
          >
            {allMatches.map((m) => {
              return (
                <Option
                  key={m.uuid}
                  value={m.uuid}
                >{`${m.firstname} ${m.lastname}`}</Option>
              );
            })}
          </Select>
        </div>
        <Title size="h5" bold>
          Zeitraum
        </Title>
        <div className={classes.inputField}>
          Vom{' '}
          <DatePicker
            disabled
            bordered={false}
            value={moment(selectedPupil?.date)}
            defaultValue={moment(moment(Date.now()), dateFormat)}
            format={dateFormat}
          />{' '}
          bis zum{' '}
          <DatePicker
            disabled={!selectedPupil}
            style={{ marginLeft: '4px', marginRight: '4px' }}
            allowClear={false}
            value={moment(certificateData.endDate * 1000)}
            onChange={(v) => {
              if (v) {
                setCertificateData({
                  ...certificateData,
                  endDate: v.unix(),
                });
              }
            }}
            disabledDate={(currentDate) => {
              return (
                moment().diff(currentDate) <= 0 ||
                moment(currentDate).isBefore(selectedPupil.date)
              );
            }}
            format={dateFormat}
          />{' '}
          ({certificateData.weekCount} Wochen)
        </div>
        <div className={classes.inputField}>
          <Checkbox
            checked={certificateData.ongoingLessons}
            onChange={(e) =>
              setCertificateData({
                ...certificateData,
                ongoingLessons: e.target.checked,
              })
            }
          >
            Unterstützung dauert noch an
          </Checkbox>
        </div>
        <Title size="h5" bold>
          Fächer
        </Title>
        <div className={classes.inputField}>
          <Select
            disabled={!selectedPupil}
            onChange={(v: string[]) => {
              setCertificateData({ ...certificateData, subjects: v });
            }}
            value={certificateData.subjects}
            mode="multiple"
            placeholder={
              selectedPupil
                ? 'Wähle deine Fächer aus'
                : 'Zuerst einen Schüler auswählen'
            }
            style={{ width: '100%' }}
          >
            {selectedPupil?.subjects.map((s) => {
              return (
                <Option key={s} value={s}>
                  {s}
                </Option>
              );
            })}
          </Select>
        </div>
        <Title size="h5" bold>
          Medium
        </Title>
        <div className={classes.inputField}>
          <Select
            placeholder="Wähle dein Medium aus"
            style={{ width: 200 }}
            value={
              certificateData.mediaType ? certificateData.mediaType : undefined
            }
            onChange={(v) => {
              if (v) {
                setCertificateData({ ...certificateData, mediaType: v });
              }
            }}
          >
            {MediaTypes.map((m) => {
              return (
                <Option key={m} value={m}>
                  {m}
                </Option>
              );
            })}
          </Select>
        </div>
        <Title size="h5" bold>
          Zeit
        </Title>
        <div className={classes.inputField}>
          <InputNumber
            min={0.25}
            max={40}
            step={0.25}
            value={certificateData.hoursPerWeek}
            onChange={(v) => {
              if (typeof v === 'number') {
                setCertificateData({ ...certificateData, hoursPerWeek: v });
              }
            }}
            className={
              !isWorkloadAllowedNumber()
                ? classes.workloadInputFieldError
                : null
            }
          />{' '}
          h/Woche (insgesamt {certificateData.hoursTotal} h)
        </div>
      </div>
    );
  };

  const renderActivityForm = () => {
    return (
      <div>
        <Text className={classes.description}>
          Schritt 2: Tätigkeiten eintragen
        </Text>
        <ActivityForm
          certificateData={certificateData}
          setCertificateData={(data) => setCertificateData(data)}
        />
      </div>
    );
  };

  const downloadPDF = () => {
    setLoading(true);
    apiContext
      .createCertificate(certificateData)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'certificate.pdf');
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch(() => {
        message.error(
          'Ein Fehler ist aufgetreten. Versuche es später nochmal.'
        );
        setLoading(false);
      });
  };

  const renderDownloadPage = () => {
    return (
      <div>
        <Text className={classes.description}>
          Schritt 3: Bescheinigung herunterladen
        </Text>

        <div className={classes.downloadContainer}>
          <Select
            defaultValue={defaultLanguage}
            onChange={(event) => setLanguage(event)}
            style={{ width: 120 }}
          >
            {Object.entries(supportedLanguages).map(([code, value]) => (
              <Option value={code}>{value}</Option>
            ))}
          </Select>
          <Button
            className={classes.downloadButton}
            backgroundColor="#4E6AE6"
            color="#ffffff"
            onClick={downloadPDF}
          >
            {loading ? (
              <ClipLoader size={20} color="#ffffff" loading={loading} />
            ) : (
              <>
                <Icons.DownloadWeb />
                Download
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderStep = (step: number) => {
    if (step === 0) {
      return renderIntroduction();
    }
    if (step === 1) {
      return renderGeneralInformationForm();
    }
    if (step === 2) {
      return renderActivityForm();
    }
    if (step === 3) {
      return renderDownloadPage();
    }

    return renderIntroduction();
  };

  const onClick = (newStep: number) => {
    if (newStep < STEPS && newStep >= 0) {
      if (newStep === 2 && !certificateData.student) {
        message.info('Ein*e Schüler*in muss ausgewählt sein.');
        return;
      }
      if (newStep === 2 && certificateData.subjects.length === 0) {
        message.info('Mindestens ein Fach muss ausgewählt sein.');
        return;
      }
      if (newStep === 2 && !certificateData.mediaType) {
        message.info('Ein Medium muss ausgewählt sein.');
        return;
      }
      if (newStep === 2 && !isWorkloadAllowedNumber()) {
        message.info(
          'Deine wöchentliche Arbeitszeit darf nur in 15-Minuten-Schritten angegeben werden. Sie muss mindestens 15 Minuten betragen und darf nicht größer als 40 Stunden sein.'
        );
        return;
      }
      if (newStep === 3 && certificateData.activities.length === 0) {
        message.info('Mindestens eine Tätigkeit muss ausgewählt sein.');
        return;
      }
      setStep(newStep);
    }
  };

  return (
    <StyledReactModal isOpen={modalContext.openedModal === 'certificateModal'}>
      <div className={classes.modal}>
        <div className={classes.stepContainer}>
          <div className={classes.titleBar}>
            <Title size="h2">Bescheinigung beantragen</Title>
            <Button
              color="#B5B5B5"
              backgroundColor="#ffffff"
              onClick={() => modalContext.setOpenedModal(null)}
            >
              <Icons.Abort />
            </Button>
          </div>
          {renderStep(currentStep)}
        </div>
        <div className={classes.buttonContainer}>
          {currentStep > 0 && (
            <Button
              backgroundColor="#F4F6FF"
              color="#4E6AE6"
              onClick={() => onClick(currentStep - 1)}
            >
              Zurück
            </Button>
          )}
          {currentStep < STEPS - 1 && (
            <Button
              backgroundColor="#F4F6FF"
              color="#4E6AE6"
              onClick={() => onClick(currentStep + 1)}
            >
              Weiter
            </Button>
          )}
        </div>
      </div>
    </StyledReactModal>
  );
};

export default CertificateModal;
