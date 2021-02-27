import React, { useContext, useState, useEffect } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Select, DatePicker, InputNumber, message, Checkbox, Spin } from 'antd';
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
import { useAPICallable } from '../../context/ApiContext';
import AccentColorButton from '../button/AccentColorButton';

const { Option } = Select;

interface Props {
  user: User;
  reloadCertificates: () => void;
}

export interface Activity {
  index: number;
  text: string;
}

export interface CertificateData {
  pupil?: string;
  endDate: number;
  hoursPerWeek: number;
  hoursTotal: number;
  subjects: string[];
  medium: string | null;
  activities: string[];
  ongoingLessons?: boolean;
  automatic?: boolean;
}

const CertificateModal: React.FC<Props> = ({ user, reloadCertificates }) => {
  const modalContext = useContext(context.Modal);
  const [createdCertificate, createCertificate, reset] = useAPICallable(
    'createCertificate'
  );

  // If the certificate was created, the cards need to be reloaded on the Settings page:
  useEffect(() => {
    if (createdCertificate.value) reloadCertificates();
  }, [createdCertificate]);

  return (
    <StyledReactModal isOpen={modalContext.openedModal === 'certificateModal'}>
      <div className={classes.modal}>
        {createdCertificate.pending && (
          <CreateCertificate
            user={user}
            createCertificate={createCertificate}
          />
        )}
        {createdCertificate.loading && (
          <div className={classes.stepContainer}>
            <div className={classes.titleBar}>
              <Title size="h2">Bescheinigung wird erstellt</Title>
            </div>
            <Spin />
          </div>
        )}
        {createdCertificate.error && (
          <div className={classes.stepContainer}>
            <div className={classes.titleBar}>
              <Title size="h2">Ein Fehler ist aufgetreten!</Title>
            </div>
            Bitte kontaktiere das CoronaSchool Team unter{' '}
            <a href="mailto:support@corona-school.de">
              support@corona-school.de
            </a>
          </div>
        )}
        {createdCertificate.value && !createdCertificate.value.automatic && (
          <DownloadCertificate
            uuid={createdCertificate.value.uuid}
            resetData={reset}
          />
        )}
        {createdCertificate.value?.automatic && (
          <StartedAutomatic resetData={reset} />
        )}
      </div>
    </StyledReactModal>
  );
};

/* ------------------ Certificate Creation Process ------------------ */

const STEPS = ['introduction', 'information', 'activity', 'mode'] as const;
type IStep = typeof STEPS[number];

/* CreateCertificate guides the user throught the creation process and shows different steps with inputs.
   Afterwards it passes all the data to the 'createCertificate' function */
function CreateCertificate({
  user,
  createCertificate,
}: {
  user: User;
  createCertificate(data: CertificateData);
}) {
  const [step, setStep] = useState<typeof STEPS[number]>('introduction');

  /* a 'nextStep' is not provided, as each step has to validate the user inputs anyways,
     so a reusable function does provide no value at all */
  const prevStep = () => setStep(STEPS[Math.max(0, STEPS.indexOf(step) - 1)]);

  const [data, setData] = useState<CertificateData>({
    endDate: moment().unix(),
    hoursPerWeek: 0,
    hoursTotal: 0,
    subjects: [],
    medium: null,
    activities: [],
    ongoingLessons: false,
  });

  function updateData(update: Partial<CertificateData>) {
    setData((prev) => ({ ...prev, ...update }));
  }

  /* Passing the same props to all steps is so beautiful, this rule just doesn't make sense */
  /* eslint react/jsx-props-no-spreading: "off" */
  const stepProps: StepProps = {
    data,
    updateData,
    setStep,
    prevStep,
    user,
    createCertificate,
  };

  if (step === 'introduction') return <IntroductionStep {...stepProps} />;

  if (step === 'information') return <InformationStep {...stepProps} />;

  if (step === 'activity') return <ActivityStep {...stepProps} />;

  if (step === 'mode') return <ChooseModeStep {...stepProps} />;
}

/* Steps inside the creation process share common behavior, such as their props, title and navigation: */

/* eslint react/no-unused-prop-types: "off" */
interface StepProps {
  createCertificate(data: CertificateData);
  updateData(data: Partial<CertificateData>);
  data: CertificateData;
  prevStep();
  setStep(step: typeof STEPS[number]);
  user: User;
}

function StepContainer({
  prevStep,
  nextStep,
  nextStepText,
  step,
  onClose,
  children,
  title,
}: React.PropsWithChildren<{
  prevStep?: () => void;
  nextStep?: () => void;
  nextStepText?: string;
  onClose?: () => void;
  step: IStep;
  title?: string;
}>) {
  const modalContext = useContext(context.Modal);

  return (
    <>
      <div className={classes.stepContainer}>
        <div className={classes.titleBar}>
          <Title size="h2">{title ?? 'Bescheinigung beantragen'}</Title>
          <Button
            color="#B5B5B5"
            backgroundColor="#ffffff"
            onClick={() => {
              modalContext.setOpenedModal(null);
              if (onClose) onClose();
            }}
          >
            <Icons.Abort />
          </Button>
        </div>
        {children}
      </div>
      <div className={classes.buttonContainer}>
        {prevStep && (
          <Button backgroundColor="#F4F6FF" color="#4E6AE6" onClick={prevStep}>
            Zurück
          </Button>
        )}
        {nextStep && (
          <Button backgroundColor="#F4F6FF" color="#4E6AE6" onClick={nextStep}>
            {nextStepText ?? 'Weiter'}
          </Button>
        )}
      </div>
    </>
  );
}

function StepHeader({ title, step }: { title: string; step: IStep }) {
  return (
    <Text className={classes.description}>
      Schritt {STEPS.indexOf(step) + 1}/{STEPS.length}: {title}
    </Text>
  );
}

function IntroductionStep({ setStep }: StepProps) {
  return (
    <StepContainer step="introduction" nextStep={() => setStep('information')}>
      <Text>
        Wir möchten uns für dein Engagement in der Corona School bedanken! Für
        deine Tätigkeit stellen wir dir gerne eine Bescheinigung aus, welche du
        bei einer Bewerbung beilegen oder bei deiner Universität einreichen
        kannst.
      </Text>
      <br />
      <Title size="h5" bold>
        Wie funktioniert’s?
      </Title>
      <Text>
        Unsere Bescheinigung besteht aus zwei Teilen, welche von
        unterschiedlichen Personen bestätigt werden. Der Corona School e.V. kann
        euch problemlos Folgendes bestätigen:
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
        angeben. Mit diesen Informationen werden wir deine*n Schüler*in
        kontaktieren und uns eine Bestätigung durch den/die
        Erziehungsberechtige*n einholen. Anschließend erhältst du eine
        automatisierte E-Mail von uns mit deiner Bescheinigung.
        <br />
        Wenn du innerhalb einer Woche nichts von uns hörst, kannst du bei
        deinem/deiner Schüler*in nochmal nachhaken oder uns unter{' '}
        <a href="mailto:support@corona-school.de">
          support@corona-school.de
        </a>{' '}
        kontaktieren.
      </Text>
    </StepContainer>
  );
}

// TODO: Split this component up
function InformationStep({
  user,
  data,
  updateData,
  setStep,
  prevStep,
}: StepProps) {
  const {
    hoursPerWeek,
    pupil,
    endDate,
    hoursTotal,
    medium,
    ongoingLessons,
    subjects,
  } = data;
  const dateFormat = 'DD/MM/YYYY';
  const MediaTypes = ['Video-Chat', 'E-Mail', 'Telefon', 'Chat-Nachrichten'];
  const allMatches = [...user.matches, ...user.dissolvedMatches];

  let weekCount = 0;

  const selectedPupil = allMatches.find((s) => s.uuid === pupil);
  if (selectedPupil) {
    const b = moment(new Date(selectedPupil.date), 'DD/MM/YYYY');
    const a = moment(new Date(endDate * 1000), 'DD/MM/YYYY');

    weekCount = a.diff(b, 'week') + 1;
  }

  const isWorkloadAllowed =
    hoursPerWeek % 0.25 === 0 && hoursPerWeek >= 0.25 && hoursPerWeek <= 40.0;

  function nextStep() {
    if (!pupil) {
      message.info('Ein*e Schüler*in muss ausgewählt sein.');
      return;
    }
    if (subjects.length === 0) {
      message.info('Mindestens ein Fach muss ausgewählt sein.');
      return;
    }
    if (!medium) {
      message.info('Ein Medium muss ausgewählt sein.');
      return;
    }
    if (!isWorkloadAllowed) {
      message.info(
        'Deine wöchentliche Arbeitszeit darf nur in 15-Minuten-Schritten angegeben werden. Sie muss mindestens 15 Minuten betragen und darf nicht größer als 40 Stunden sein.'
      );
      return;
    }

    setStep('activity');
  }

  if (allMatches.length === 0) {
    return (
      <StepContainer step="information" prevStep={prevStep}>
        <div>
          <Title size="h2">Zertifikat erstellen</Title>
          <Text>Du hast keine Matches</Text>
        </div>
      </StepContainer>
    );
  }

  return (
    <StepContainer step="information" prevStep={prevStep} nextStep={nextStep}>
      <StepHeader step="information" title="Informationen eintragen" />
      <div className={classes.generalInformationContainer}>
        <Title size="h5" bold>
          Schüler*in
        </Title>
        <div className={classes.inputField}>
          <Select
            placeholder="Wähle deine*n Schüler*in"
            value={pupil}
            onChange={(pupil) => {
              updateData({
                pupil,
                subjects: [],
                /* reset as otherwise an invalid value for the end date may occur
                    if the current endDate value from a previously selected is before the
                    startdate that was currently set */
                endDate: moment().unix(),
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
            value={moment(endDate * 1000)}
            onChange={(v) => {
              if (v) {
                updateData({
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
          ({weekCount} Wochen)
        </div>
        <div className={classes.inputField}>
          <Checkbox
            checked={ongoingLessons}
            onChange={(e) =>
              updateData({
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
              updateData({ subjects: v });
            }}
            value={subjects}
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
            value={medium || undefined}
            onChange={(medium) => {
              if (medium) {
                updateData({ medium });
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
        <WorkloadInput
          hoursPerWeek={hoursPerWeek}
          hoursTotal={hoursTotal}
          updateData={updateData}
          weekCount={weekCount}
        />
      </div>
    </StepContainer>
  );
}

function WorkloadInput({
  hoursPerWeek,
  hoursTotal,
  weekCount,
  updateData,
}: {
  weekCount: number;
  hoursPerWeek: number;
  hoursTotal: number;
  updateData(data: Partial<CertificateData>);
}) {
  const toQuarters = (it: number) => Math.round(it * 4) / 4;

  function setHoursPerWeek(_hoursPerWeek: number) {
    const hoursTotal = toQuarters(_hoursPerWeek * weekCount);
    const hoursPerWeek = toQuarters(_hoursPerWeek);
    updateData({ hoursPerWeek, hoursTotal });
  }

  function setHoursTotal(_hoursTotal: number) {
    const hoursPerWeek = toQuarters(_hoursTotal / weekCount) || 0;
    const hoursTotal = toQuarters(_hoursTotal);
    updateData({ hoursPerWeek, hoursTotal });
  }

  return (
    <>
      <Title size="h5" bold>
        Zeit
      </Title>
      <div className={classes.inputField}>
        <InputNumber
          min={0}
          max={40}
          step={0.25}
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          disabled={!weekCount}
        />{' '}
        h/Woche durchschnittlich
      </div>
      <div className={classes.inputField}>
        <InputNumber
          min={0}
          max={100000}
          step={0.25}
          value={hoursTotal}
          onChange={setHoursTotal}
          disabled={!weekCount}
        />{' '}
        h insgesamt
      </div>
    </>
  );
}

function ActivityStep({ data, updateData, setStep, prevStep }: StepProps) {
  function nextStep() {
    if (data.activities.length === 0) {
      message.info('Mindestens eine Tätigkeit muss ausgewählt sein.');
      return;
    }

    setStep('mode');
  }

  return (
    <StepContainer step="activity" nextStep={nextStep} prevStep={prevStep}>
      <StepHeader step="activity" title="Tätigkeiten eintragen" />
      <ActivityForm certificateData={data} setCertificateData={updateData} />
    </StepContainer>
  );
}

function ChooseModeStep({ data, prevStep, createCertificate }: StepProps) {
  return (
    <StepContainer step="mode" prevStep={prevStep}>
      <StepHeader step="mode" title="Modus auswählen" />
      Alles fertig ausgefüllt? Dann kannst du die Daten jetzt abschicken:
      <Button
        color="#ffffff"
        backgroundColor="#4E6AE6"
        onClick={() => createCertificate({ ...data, automatic: true })}
      >
        Bescheinigung automatisch anfordern
      </Button>
      Alternativ kannst du die Bescheinigung auch manuell herunterladen, und an
      deine*n Schüler*in per E-Mail verschicken:
      <Button
        backgroundColor="#585858"
        color="white"
        onClick={() => createCertificate(data)}
      >
        Stattdessen manuell erstellen
      </Button>
    </StepContainer>
  );
}

function StartedAutomatic({ resetData }: { resetData() }) {
  return (
    <StepContainer
      step="mode"
      title="Automatischen Prozess gestartet!"
      onClose={resetData}
    >
      Geschafft! Wir haben eine E-Mail an deine*n Schüler*in gesendet und warten
      auf die Bestätigung der Informationen durch den/die
      Erziehungsberechtige*n. Wir melden uns danach sofort bei dir per E-Mail
      mit der fertigen Bescheinigung.
    </StepContainer>
  );
}

/* The DownloadCertificate is shown when the user chooses the Manual Process, and directly
   wants to download their certificate to send it to the pupil */
function DownloadCertificate({
  uuid,
  resetData,
}: {
  uuid: string;
  resetData();
}) {
  const [certificateBlob, loadCertificate] = useAPICallable('getCertificate');
  const [language, setLanguage] = useState<ISupportedLanguage>(defaultLanguage);

  /* If the certificate was loaded, automatically download it */
  useEffect(() => {
    if (!certificateBlob.value) return;

    try {
      const url = window.URL.createObjectURL(new Blob([certificateBlob.value]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificate.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      message.error('Ein Fehler ist aufgetreten. Kontaktiere die CoronaSchool');
    }
  }, [certificateBlob]);

  if (certificateBlob.loading) {
    return (
      <StepContainer
        step="mode"
        title="Bescheinigung herunterladen"
        onClose={resetData}
      >
        <Spin />
      </StepContainer>
    );
  }

  if (certificateBlob.error) {
    return (
      <StepContainer
        step="mode"
        title="Bescheinigung herunterladen"
        onClose={resetData}
      >
        <div className={classes.downloadContainer}>
          Ein Fehler ist aufgetreten. Bitte lade die Seite neu, und versuche es
          erneut.
        </div>
      </StepContainer>
    );
  }

  return (
    <StepContainer
      step="mode"
      title="Bescheinigung herunterladen"
      onClose={resetData}
    >
      <div className={classes.downloadContainer}>
        <Select
          value={language}
          onChange={(lang) => setLanguage(lang)}
          style={{ width: 120 }}
        >
          {Object.entries(supportedLanguages).map(([code, value]) => (
            <Option value={code}>{value}</Option>
          ))}
        </Select>
        <AccentColorButton
          className={classes.downloadButton}
          accentColor="#4E6AE6"
          onClick={() => loadCertificate(uuid, language)}
          Icon={Icons.DownloadWeb}
          label="Download"
        />
      </div>
    </StepContainer>
  );
}

export default CertificateModal;
