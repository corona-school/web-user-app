import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import ClipLoader from 'react-spinners/ClipLoader';

import context from '../../context';
import classes from './CertificateModal.module.scss';
import { Title, Text } from '../Typography';
import Button from '../button';
import Icons from '../../assets/icons';
import { User } from '../../types';
import { Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';

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
  hoursPerWeek: number;
  subjects: string[];
  mediaType: string | null;
  activities: Activity[];
}

const CertificateModal: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData>({
    endDate: Date.now(),
    hoursPerWeek: 1.0,
    subjects: [],
    mediaType: null,
    activities: [],
  });

  const [currentStep, setStep] = useState(0);
  const modalContext = useContext(context.Modal);
  const apiContext = useContext(context.Api);

  const renderIntroduction = () => {
    return (
      <>
        <Text>
          Wir möchten uns für dein Engagement in der Corona School bedanken! Für
          deine Tätigkeit stellen wir dir gerne eine Bescheinigung aus, welche
          du bei einer Bewerbung beilegen oder bei deiner Universität einreichen
          kannst.
        </Text>
        <br></br>
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
          <li>
            die genauen Inhalte und Aufgaben der ehrenamtlichen Tätigkeit
            angeben.
          </li>
          Daraus erstellen wir dir ein fertiges PDF, welches du an deine*n
          Schüler*in zum Unterschreiben schicken kannst.
        </Text>
      </>
    );
  };

  const renderGeneralInformationForm = () => {
    const dateFormat = 'DD/MM/YYYY';
    const MediaTypes = ['Video-Chat', 'E-Mail', 'Telefon', 'Chat-Nachrichten'];

    if (user.matches.length === 0) {
      return (
        <div>
          <Title size="h2">Zertifikat erstellen</Title>
          <Text>Du hast keien Matches</Text>
        </div>
      );
    }

    const selectedPupil = user.matches.find(
      (s) => s.uuid === certificateData.student
    );

    return (
      <div className={classes.generalInformationContainer}>
        <Text className={classes.description}>
          1/3 Allgemeine Informationen eintragen
        </Text>
        <Title size="h5" bold>
          Schüler
        </Title>
        <div className={classes.inputField}>
          <Select
            placeholder={'Wähle deinen Schüler'}
            value={certificateData.student}
            onChange={(v) => {
              setCertificateData({
                ...certificateData,
                student: v,
                subjects: [],
              });
            }}
            style={{ width: '200px' }}
          >
            {user.matches.map((m) => {
              return (
                <Option value={m.uuid}>{`${m.firstname} ${m.lastname}`}</Option>
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
            defaultValue={moment(moment(Date.now()), dateFormat)}
            format={dateFormat}
          />{' '}
          bis zum{' '}
          <DatePicker
            style={{ marginLeft: '4px' }}
            allowClear={false}
            value={moment(certificateData.endDate)}
            onChange={(v) => {
              if (v) {
                setCertificateData({ ...certificateData, endDate: v.unix() });
              }
            }}
            disabledDate={(currentDate) => {
              return moment().diff(currentDate) <= 0;
            }}
            format={dateFormat}
          />
        </div>
        <Title size="h5" bold>
          Fächer
        </Title>
        <div className={classes.inputField}>
          <Select
            onChange={(v: string[]) => {
              setCertificateData({ ...certificateData, subjects: v });
            }}
            value={certificateData.subjects}
            mode="multiple"
            placeholder="Wähle deine Fächer aus"
            style={{ width: '100%' }}
          >
            {selectedPupil?.subjects.map((s) => {
              return <Option value={s}>{s}</Option>;
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
              return <Option value={m}>{m}</Option>;
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
          />{' '}
          h/Woche
        </div>
      </div>
    );
  };

  const renderActivityForm = () => {
    const activities = [
      'Vorbereitung, Planung und Gestaltung von Unterrichtsstunden',
      'Bearbeitung und Vermittlung von Unterrichtsinhalten',
      'Digitale Aufbereitung und Veranschaulichung von Unterrichtsinhalten',
      'Vertiefung und Wiederholung von Unterrichtsinhalten',
      'Gemeinsame Bearbeitung von Übungs- und Hausaufgaben',
      'Korrektur von Übungs- und Hausaufgaben',
      'Digitale Unterstützung bei der Prüfungsvorbereitung',
      'Digitale Unterstützung beim Lernen',
      'Begleitung auf dem Weg zum selbstständigen Lernen]',
    ];

    return (
      <div>
        <Text className={classes.description}>2/3 Tätigkeiten eintragen</Text>
        {[0, 1, 2, 3, 4].map((i) => {
          return (
            <Select
              allowClear
              value={
                certificateData.activities.find((k) => k.index === i)?.text
              }
              onChange={(v: string) => {
                if (!v) {
                  const newActivies: Activity[] = certificateData.activities.filter(
                    (a) => a.index !== i
                  );
                  setCertificateData({
                    ...certificateData,
                    activities: newActivies,
                  });
                  return;
                }
                const newActivies: Activity[] = [
                  ...certificateData.activities,
                  {
                    index: i,
                    text: v,
                  },
                ];
                setCertificateData({
                  ...certificateData,
                  activities: newActivies,
                });
              }}
              placeholder="Wähle eine Tätigkeit aus"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {activities
                .filter(
                  (a) =>
                    !certificateData.activities.map((a) => a.text).includes(a)
                )
                .map((a) => {
                  return <Option value={a}>{a}</Option>;
                })}
            </Select>
          );
        })}
      </div>
    );
  };

  const downloadPDF = () => {
    setLoading(true);
    apiContext
      .getCertificate(certificateData)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'test.pdf');
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderDownloadPage = () => {
    return (
      <div>
        <Text className={classes.description}>
          3/3 Zertifikat herunterladen
        </Text>

        <div className={classes.downloadContainer}>
          <Button
            className={classes.downloadButton}
            backgroundColor="#4E6AE6"
            color="#ffffff"
            onClick={downloadPDF}
          >
            {loading ? (
              <ClipLoader size={20} color={'#ffffff'} loading={loading} />
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
  };

  const onClick = (newStep: number) => {
    if (newStep < STEPS && newStep >= 0) {
      setStep(newStep);
    }
  };

  return (
    <StyledReactModal isOpen={modalContext.openedModal === 'certificateModal'}>
      <div className={classes.modal}>
        <div className={classes.stepContainer}>
          <div className={classes.titleBar}>
            <Title size="h2">Zertifikat beantragen</Title>
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
