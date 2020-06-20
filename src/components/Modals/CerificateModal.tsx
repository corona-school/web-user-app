import React, { useContext, useState, useEffect } from 'react';
import StyledReactModal from 'styled-react-modal';
import ClipLoader from 'react-spinners/ClipLoader';

import context from '../../context';
import classes from './CertificateModal.module.scss';
import { Title, Text } from '../Typography';
import Button from '../button';
import Icons from '../../assets/icons';
import { User } from '../../types';
import { Match } from '../../types';
import { Select, DatePicker, InputNumber, message } from 'antd';
import moment, { Moment } from 'moment';
import ActivityForm from '../forms/ActivityForm';

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
  startDate: number;
  endDate: number;
  weekCount: number;
  hoursPerWeek: number;
  hoursTotal: number;
  subjects: string[];
  mediaType: string | null;
  activities: string[];
}

const CertificateModal: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const allMatches = [...user.matches, ...user.dissolved_matches];

  const [certificateData, setCertificateData] = useState<CertificateData>({
    startDate: moment().unix(),
    endDate: moment().unix(),
    weekCount: 0,
    hoursPerWeek: 1.0,
    hoursTotal: 0,
    subjects: [],
    mediaType: null,
    activities: [],
  });

  const [currentStep, setStep] = useState(0);
  const modalContext = useContext(context.Modal);
  const apiContext = useContext(context.Api);

  useEffect(() => {
    const selectedPupil = user.matches.find(
      (s) => s.uuid === certificateData.student
    );
    if (selectedPupil) {
      const b = moment(new Date(selectedPupil.date), 'DD/MM/YYYY');
      const a = moment(new Date(certificateData.endDate * 1000), 'DD/MM/YYYY');

      const weekCount = a.diff(b, 'week');
      setCertificateData({
        ...certificateData,
        weekCount: weekCount,
        hoursTotal: certificateData.hoursPerWeek * weekCount,
      });
    }
  }, [
    user.matches,
    certificateData.hoursPerWeek,
    certificateData.endDate,
    certificateData.student,
  ]);

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
  
  const handleDatePickerValue = (selectedPupil: Match, dateFormat: string) => {
    let dateValue : Moment; 
    if(user.dissolved_matches.includes(selectedPupil)) {
      dateValue = moment(certificateData.startDate * 1000);
    } else {
      dateValue = moment(moment(Date.now()), dateFormat);
    }
    return dateValue; 
  }

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
            {allMatches.map((m) => {
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
            disabled={!user.dissolved_matches.includes(selectedPupil)}
            bordered={user.dissolved_matches.includes(selectedPupil)}
            value={handleDatePickerValue(selectedPupil, dateFormat)}
            defaultValue={moment(moment(Date.now()), dateFormat)}
            format={dateFormat}
            onChange={(v) => {
              if (v) {
                setCertificateData({
                  ...certificateData,
                  startDate: v.unix()
                })
              }
            }}
          />{' '}
          bis zum{' '}
          <DatePicker
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
              return moment().diff(currentDate) <= 0;
            }}
            format={dateFormat}
          />{' '}
          ({certificateData.weekCount} Wochen)
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
      .getCertificate(certificateData)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'certificate.pdf');
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        message.error(
          'Ein Fehler ist aufgetreten. Versuche er später nochmal.'
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
      if (newStep === 2 && !certificateData.student) {
        message.info('Ein Schüler muss ausgewählt sein.');
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
