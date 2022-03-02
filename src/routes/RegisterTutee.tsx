import React, { useState, useContext } from 'react';
import { Form, Input, Select, message, Radio, InputNumber } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { useHistory, useLocation, Link } from 'react-router-dom';
import qs from 'qs';
import Icons from '../assets/icons';
import { Title, Text } from '../components/Typography';
import Button from '../components/button';
import classes from './RegisterTutee.module.scss';
import { Subject } from '../types';
import Context from '../context';
import { SchoolInfo, Tutee } from '../types/Registration';
import { emailDomainIsEqual } from '../utils/EmailUtils';
import { CooperationMode } from '../utils/RegistrationCooperationUtils';
import { RegisterDrehtuerTutee } from './RegisterDrehtuerTutee';
import {
  DataProtectionField,
  EmailField,
  GradeField,
  NameField,
  NewsletterField,
  SchoolKindField,
  StateField,
  MessageField,
} from '../components/forms/registration';
import { env } from '../api/config';
import { NoRegistration } from '../components/NoService';
import { languageOptions } from '../assets/languages';
import { learningGermanSinceOptions } from '../assets/learningGermanSinceOptions';
import SignupContainer from '../components/container/SignupContainer';
import AccentColorButton from '../components/button/AccentColorButton';
import { ReactComponent as ClockIcon } from '../assets/icons/clock-regular.svg';
import { ReactComponent as MagicIcon } from '../assets/icons/magic-solid.svg';
import { MatomoTrackRegistration } from '../components/misc/MatomoSupport';

const { Option } = Select;

interface FormData {
  // start
  firstname?: string;
  lastname?: string;
  email?: string;
  grade?: number;
  isTutee?: boolean;
  isJufo?: boolean;
  // isProjectCoachee
  project?: string[];
  isJufoParticipant?: 'yes' | 'no' | 'unsure' | 'neverheard';
  projectMemberCount?: number;
  // isTutee
  subjects?: Subject[];
  // finish
  state?: string;
  school?: string;
  msg?: string;
  newsletter?: boolean;
  teacherEmail?: string;
  languages?: typeof languageOptions[number][];
  learningGermanSince?: string;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
interface Props {
  cooperationMode?: CooperationMode;
  isJufoSubdomain?: boolean;
  isDrehtuerSubdomain?: boolean;
  isCoDuSubdomain?: boolean;
}

function AutoMatchChooser({ setRequestsAutoMatch, nextStep }) {
  const [renderNote, setRenderNote] = useState(false);
  return (
    <>
      <h1 className={classes.autoMatchHeadline}>Wie möchtest du fortfahren?</h1>
      <AccentColorButton
        accentColor="#0366e0"
        onClick={() => {
          setRenderNote(true);
        }}
        className={classes.autoMatch}
      >
        <div className={classes.autoMatchIconWrapper}>
          <MagicIcon />
        </div>
        <div className={classes.autoMatchTextWrapper}>
          <h3>Ich möchte möglichst schnell Hilfe erhalten.</h3>
          <p>
            Mit dieser Option gehen wir direkt auf die Suche nach einem:r
            Lernpartner:in für dich, nachdem du deine E-Mail-Adresse bestätigt
            hast. Wir benachrichtigen dich per E-Mail, sobald wir jemanden
            gefunden haben.
          </p>
        </div>
      </AccentColorButton>
      {renderNote && (
        <div className={classes.autoMatchNote}>
          <b>Achtung: Lange Wartezeit</b>
          <p>
            Derzeit benötigen sehr viele Schüler:innen in Deutschland unsere
            Hilfe, unsere Warteliste ist daher lang. Aktuell dauert es zwischen
            <b> 30 und 90 Tagen</b>, bis wir dich mit einem:r geeigneten
            Helfer:in verbinden können. Bitte schließe die Registrierung nur
            dann ab, wenn du bereit bist, so lange zu warten. Wir geben unser
            Bestes, allen Schüler:innen die nötige Unterstützung zur Verfügung
            zu stellen.
          </p>
          <p>Vielen Dank für dein Verständnis!</p>
          <div className={classes.autoMatchNoteButtonBox}>
            <AccentColorButton
              accentColor="#e00315"
              label="Abbrechen"
              small
              onClick={() => {
                setRenderNote(false);
              }}
            />
            <AccentColorButton
              accentColor="#0366e0"
              label="Ich bin bereit, zu warten"
              small
              onClick={(e) => {
                setRequestsAutoMatch(true);
                nextStep(e);
              }}
            />
          </div>
        </div>
      )}
      {!renderNote && (
        <AccentColorButton
          accentColor="#0366e0"
          onClick={(e) => {
            setRequestsAutoMatch(false);
            nextStep(e);
          }}
          className={classes.autoMatch}
        >
          <div className={classes.autoMatchIconWrapper}>
            <ClockIcon />
          </div>
          <div className={classes.autoMatchTextWrapper}>
            <h3>Ich möchte mich erstmal nur umsehen.</h3>
            <p>
              Mit dieser Option kannst du zu einem späteren Zeitpunkt selbst
              eine:n Lernpartner:in anfordern.
            </p>
          </div>
        </AccentColorButton>
      )}
    </>
  );
}

function initFormData(isCoDuSubdomain: boolean) {
  if (isCoDuSubdomain) {
    return {
      isTutee: true,
    };
  }
  return {};
}

const RegisterTutee: React.FC<Props> = ({
  cooperationMode,
  isJufoSubdomain,
  isDrehtuerSubdomain,
  isCoDuSubdomain,
}) => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<
    'start' | 'detail' | 'autoMatchChooser' | 'finish' | 'done'
  >('start');

  const [isGermanNative, setIsGermanNative] = useState<boolean>(true);
  const [dazOnly, setDazOnly] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>(
    initFormData(isCoDuSubdomain)
  );
  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

  const redirectTo = useQuery().get('redirectTo');

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo[]>(null);

  const isTutee = isCoDuSubdomain || !isJufoSubdomain;

  const isJufo = isJufoSubdomain;

  const [requestsAutoMatch, setRequestsAutoMatch] = useState(false);

  if (env.REACT_APP_TUTEE_REGISTRATION === 'disabled') {
    return <NoRegistration />;
  }

  if (!!cooperationMode && !loading && schoolInfo == null) {
    // load school info
    setLoading(true);
    apiContext
      .getCooperatingSchools(
        cooperationMode.kind === 'SpecificStateCooperation'
          ? cooperationMode.stateInfo.abbrev
          : null
      )
      .then((schools) => {
        setSchoolInfo(schools);
        setLoading(false);
      })
      .catch(() => {
        // in case of an error, do not check school's email domain at input time
        setLoading(false);
        setSchoolInfo([]);
      });
  }

  const SetDaZStatus = (learningGermanSince) => {
    form.setFieldsValue({ subjects: ['Deutsch als Zweitsprache'] });

    switch (learningGermanSince) {
      case 'greaterThanFour':
      case 'twoToFour':
        setDazOnly(false);
        break;
      case 'oneToTwo':
      case 'lessThanOne':
        setDazOnly(true);
        break;
      default:
        break;
    }
  };

  const renderStart = () => {
    return (
      <>
        {isTutee && !isCoDuSubdomain && !cooperationMode && (
          <div className={classes.registrationHint}>
            <Text>
              Die Lernunterstützung richtet sich ausschließlich an
              Schüler:innen, die keine oder nur sehr eingeschränkt Möglichkeiten
              haben, herkömmliche Bildungsangebote (wie z.B. bezahlte Nachhilfe){' '}
              wahrzunehmen. Dies kann finanzielle, soziale, persönliche oder{' '}
              kulturelle Gründe haben.{' '}
              <b>
                Bitte melde dich für die Lernunterstützung nur an, wenn das bei
                dir zutrifft.
              </b>
            </Text>
          </div>
        )}

        <NameField
          firstname={formData.firstname}
          lastname={formData.lastname}
          className={classes.formItem}
        />

        <EmailField
          initialValue={formData.email}
          className={classes.formItem}
        />
      </>
    );
  };

  const renderDetail = () => {
    return (
      <>
        {!cooperationMode && (
          <SchoolKindField
            isJufo={isJufo}
            className={classes.formItem}
            defaultSchoolKind={formData.school}
          />
        )}

        {cooperationMode?.kind !== 'GeneralSchoolCooperation' &&
          !isCoDuSubdomain && (
            <StateField
              className={classes.formItem}
              defaultState={
                cooperationMode?.stateInfo?.abbrev.toUpperCase() ??
                formData.state
              }
              disabled={!!cooperationMode}
            />
          )}
        <GradeField
          className={classes.formItem}
          defaultGrade={formData.grade ? `${formData.grade}` : undefined}
          emptyOption={isJufo && !cooperationMode}
          allowEverything={isJufo}
        />
        {isJufo && (
          <Form.Item
            className={classes.formItem}
            label="Welchem Fachgebiet ist dein Projekt zuzuordnen?"
            name="project"
            rules={[
              () => ({
                required: true,
                validator(_, value) {
                  if (!value || value.length === 0) {
                    return Promise.reject(
                      'Bitte wähle min. ein Fachgebiet aus.'
                    );
                  }
                  if (value.length <= 2) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'Du darfst maximal 2 Fachgebiete auswählen!'
                  );
                },
              }),
            ]}
            initialValue={formData.project ? `${formData.project}` : undefined}
          >
            <Select
              placeholder="Bitte wähle min. ein Fachgebiet aus"
              mode="multiple"
              allowClear
            >
              <Option value="Arbeitswelt">Arbeitswelt</Option>
              <Option value="Biologie">Biologie</Option>
              <Option value="Chemie">Chemie</Option>
              <Option value="Geo-und-Raumwissenschaften">
                Geo- und Raumwissenschaften
              </Option>
              <Option value="Mathematik/Informatik">
                Mathematik/Informatik
              </Option>
              <Option value="Physik">Physik</Option>
              <Option value="Technik">Technik</Option>
            </Select>
          </Form.Item>
        )}
        {isJufo && (
          <Form.Item
            className={classes.formItem}
            label="Nimmst du an Jugend forscht teil?"
            name="isJufoParticipant"
            rules={[
              {
                required: true,
                message: 'Bitte wähle eine Option aus.',
              },
            ]}
            initialValue={
              formData.isJufoParticipant
                ? `${formData.isJufoParticipant}`
                : 'yes'
            }
          >
            <Radio.Group>
              <Radio.Button value="yes">Ja</Radio.Button>
              <Radio.Button value="no">Nein</Radio.Button>
              <Radio.Button value="unsure">Weiß noch nicht</Radio.Button>
              {!isJufoSubdomain && (
                <Radio.Button value="neverheard">
                  Weiß nicht, was das ist{' '}
                  <span
                    role="img"
                    aria-label="Emoji mit hochgezogener Augenbraue"
                  >
                    🤨
                  </span>
                </Radio.Button>
              )}
            </Radio.Group>
          </Form.Item>
        )}
        {isJufo && (
          <Form.Item
            label="Wie viele Personen (inklusive dir) arbeiten an dem Projekt?"
            className={classes.formItem}
            name="projectMemberCount"
            initialValue={1}
            rules={[
              () => ({
                required: true,
                validator(_, value) {
                  if (!value || value < 1 || value > 3) {
                    return Promise.reject(
                      'Maximal 3 Personen dürfen an einem Projekt arbeiten!'
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            extra="Hinweis für Gruppen: Es muss sich nur euer:e Gruppensprecher:in anmelden, wenn ihr als Team teilnehmen möchtet."
          >
            <InputNumber
              style={{ margin: '0px 4px', width: '64px' }}
              min={1}
              max={3}
            />
          </Form.Item>
        )}
        {isTutee && (
          <Form.Item
            className={classes.formItem}
            label="Welche Sprachen sprichst du fließend?"
            name="languages"
            rules={[
              {
                required: true,
                message:
                  'Bitte trage die Sprachen ein, die du fließend sprichst.',
              },
            ]}
            initialValue={formData.languages}
          >
            <Select
              mode="multiple"
              placeholder="Bitte wähle deine Sprachen aus"
              onChange={(value) =>
                setIsGermanNative(Object.values(value).includes('Deutsch'))
              }
            >
              {languageOptions.map((l) => (
                <Option value={l}>{l}</Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {isTutee && !isGermanNative && (
          <Form.Item
            className={classes.formItem}
            label="Seit wann lernst du Deutsch?"
            name="learningGermanSince"
            rules={[
              {
                required: true,
                message: 'Bitte gebe an, seit wann du Deutsch lernst.',
              },
            ]}
            initialValue={formData.learningGermanSince}
          >
            <Select
              placeholder="Bitte gebe an, seit wann du Deutsch lernst."
              onChange={SetDaZStatus}
            >
              {Object.entries(learningGermanSinceOptions).map(
                ([key, value]) => (
                  <Option value={key}>{value}</Option>
                )
              )}
            </Select>
          </Form.Item>
        )}
        {dazOnly && !isGermanNative && (
          <Text style={{ paddingLeft: '8px' }}>
            Es sieht so aus, als ob du noch Unterstützung bei der deutschen
            Sprache benötigst. Deswegen wirst du von uns mit einem/einer
            Helfer:in verbunden, der/die dir gezielt dabei hilft, deine
            Deutschkenntnisse zu verbessern. Aus diesem Grund kannst du zum
            jetzigen Zeitpunkt nur “Deutsch als Zweitsprache” als Fach
            auswählen. In anderen Fächern können wir dich leider nicht
            unterstützen.
          </Text>
        )}
        {isTutee && (
          <Form.Item
            className={classes.formItem}
            label="In welchen Fächern benötigst du Unterstützung?"
            name="subjects"
            rules={[
              {
                required: true,
                message:
                  'Bitte trage die Fächer ein, in denen du Unterstützung benötigst',
              },
              () => ({
                validator(rule, value) {
                  if (value.length < 6) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'Du darfst maximal 5 Fächer auswählen!'
                  );
                },
              }),
              () => ({
                validator(_, value: string[]) {
                  if (
                    !isCoDuSubdomain ||
                    value.filter((v) =>
                      ['Deutsch', 'Englisch', 'Mathematik'].includes(v)
                    ).length > 0
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'Du musst Deutsch, Englisch und/ oder Mathematik wählen.'
                    )
                  );
                },
              }),
            ]}
            initialValue={
              formData.subjects
                ? formData.subjects.map((s) => s.name)
                : undefined
            }
            dependencies={['learningGermanSince']}
            shouldUpdate
          >
            <Select
              mode="multiple"
              placeholder="Bitte, wähle deine Fächer aus."
              disabled={dazOnly && !isGermanNative}
            >
              <Option value="Deutsch">Deutsch</Option>
              <Option value="Englisch">Englisch</Option>
              <Option value="Französisch">Französisch</Option>
              <Option value="Spanisch">Spanisch</Option>
              <Option value="Latein">Latein</Option>
              <Option value="Italienisch">Italienisch</Option>
              <Option value="Russisch">Russisch</Option>
              <Option value="Altgriechisch">Altgriechisch</Option>
              <Option value="Niederländisch">Niederländisch</Option>
              <Option value="Deutsch als Zweitsprache">
                Deutsch als Zweitsprache
              </Option>
              <Option value="Mathematik">Mathematik</Option>
              <Option value="Biologie">Biologie</Option>
              <Option value="Physik">Physik</Option>
              <Option value="Chemie">Chemie</Option>
              <Option value="Informatik">Informatik</Option>
              <Option value="Sachkunde">Sachkunde</Option>
              <Option value="Geschichte">Geschichte</Option>
              <Option value="Politik">Politik</Option>
              <Option value="Wirtschaft">Wirtschaft</Option>
              <Option value="Erdkunde">Erdkunde</Option>
              <Option value="Philosophie">Philosophie</Option>
              <Option value="Musik">Musik</Option>
              <Option value="Pädagogik">Pädagogik</Option>
              <Option value="Kunst">Kunst</Option>
            </Select>
          </Form.Item>
        )}
        {!!cooperationMode && (
          <Form.Item
            className={classes.formItem}
            label="E-Mail-Adresse Lehrer:in"
            name="teacherEmail"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Bitte nutze eine gültige E-Mail-Adresse.',
                validateTrigger: 'onSubmit',
              },
              {
                required: true,
                validateTrigger: 'onSubmit',
                validator: (rule, value) => {
                  if (
                    schoolInfo?.length === 0 || // then check if submitted to server
                    schoolInfo
                      ?.map((s) => s.emailDomain)
                      .some((d) => emailDomainIsEqual(value, d))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'Diese E-Mail-Adresse muss einer Lehrkraft an einer der teilnehmenden Partnerschulen gehören!'
                  );
                },
              },
            ]}
            initialValue={formData.teacherEmail}
            extra="Beachte bitte, dass du hier nicht deine eigene, sondern die E-Mail-Adresse deiner Lehrkraft angeben musst. Mit dieser Angabe können wir dich deiner Schule zuordnen."
          >
            <Input
              placeholder="Hier die E-Mail-Adresse deines/deiner Lehrer:in"
              type="email"
            />
          </Form.Item>
        )}
        <MessageField className={classes.formItem} />
      </>
    );
  };

  const renderFinish = () => {
    return (
      <>
        <NewsletterField
          className={classes.formItem}
          defaultChecked={formData.newsletter}
          isPupil
        />
        <DataProtectionField
          className={classes.formItem}
          isCodu={isCoDuSubdomain}
          isTutor={false}
        />
      </>
    );
  };
  const renderDone = () => {
    return (
      <div className={classes.successContainer}>
        <Title className={classes.successTitle} size="h4">
          Wir haben dir eine E-Mail geschickt.
        </Title>
        <Icons.SignupEmailSent />
      </div>
    );
  };

  const back = () => {
    if (formState === 'finish') {
      if (isCoDuSubdomain) {
        setFormState('detail');
        return;
      }
      if (isTutee) {
        setFormState('autoMatchChooser');
      } else {
        // skip auto match view if user hasn't signed up for tutoring
        setFormState('detail');
      }
    }
    if (formState === 'autoMatchChooser') {
      setFormState('detail');
    }
    if (formState === 'detail') {
      setFormState('start');
    }
    if (formState === 'done') {
      setFormState('start');
    }
  };

  const mapFormDataToTutee = (data: FormData): Tutee | null => {
    const coduToken = qs.parse(location.search, { ignoreQueryPrefix: true })[
      'c-token'
    ];

    const registrationSource = isCoDuSubdomain ? 'codu' : undefined;

    if (
      !data.firstname ||
      !data.lastname ||
      !data.email ||
      (!data.grade && !isJufo) ||
      (!data.state &&
        (!cooperationMode ||
          cooperationMode.kind === 'SpecificStateCooperation') &&
        !isCoDuSubdomain) ||
      (!coduToken && isCoDuSubdomain)
    ) {
      return null;
    }

    const subjects =
      data.learningGermanSince === learningGermanSinceOptions.lessThanOne ||
      data.learningGermanSince === learningGermanSinceOptions.oneToTwo
        ? [{ name: 'Deutsch als Zweitsprache' }]
        : data.subjects;

    return {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email.toLowerCase(),
      isTutee: isCoDuSubdomain || !isJufoSubdomain,
      subjects: subjects || [],
      grade: data.grade,
      school: data.school?.toLowerCase(),
      state: data.state?.toLowerCase() || 'other',
      isProjectCoachee: !!isJufoSubdomain,
      isJufoParticipant: data.isJufoParticipant,
      projectFields: data.project,
      projectMemberCount: data.projectMemberCount,
      newsletter: !!data.newsletter,
      msg: data.msg || '',
      teacherEmail: data.teacherEmail,
      languages: data.languages || [],
      learningGermanSince: data.learningGermanSince,
      redirectTo,
      requestsAutoMatch,
      coduToken,
      registrationSource,
    };
  };

  const register = (data: FormData) => {
    const tutee = mapFormDataToTutee(data);
    if (!tutee) {
      message.error('Es ist ein Fehler aufgetreten.');
      return;
    }
    console.log(tutee);

    const registerAPICall = () => {
      if (cooperationMode) {
        return apiContext.registerStateTutee;
      }
      return apiContext.registerTutee;
    };
    setLoading(true);
    registerAPICall()(tutee)
      .then(() => {
        setLoading(false);
        setFormState('done');
        setFormData({
          firstname: undefined,
          lastname: undefined,
          email: undefined,
          subjects: undefined,
          msg: undefined,
          newsletter: undefined,
          state: undefined,
          isTutee: undefined,
        });
        form.resetFields();
        MatomoTrackRegistration();
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setLoading(false);
          message.error('Du bist schon als Schüler:in bei uns eingetragen.');
          return;
        }
        setLoading(false);
        message.error('Es ist ein Fehler aufgetreten.');
      });
  };

  const nextStep = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (formState === 'done') {
      history.push('/login');
      return;
    }

    try {
      const formValues = await form.validateFields();
      console.log(formValues);

      if (formState === 'start') {
        setFormData({
          ...formData,
          firstname: formValues.firstname,
          lastname: formValues.lastname,
          email: formValues.email,
          isTutee,
          isJufo,
        });

        setFormState('detail');
      }
      if (formState === 'detail') {
        setFormData({
          ...formData,
          state: formValues.state,
          school: formValues.school,
          project: formValues.project || [],
          grade: parseInt(formValues.grade),
          subjects: isTutee
            ? formValues.subjects.map((s) => ({
                name: s,
                minGrade: 1,
                maxGrade: 13,
              }))
            : undefined,
          msg: formValues.msg,
          teacherEmail: formValues.teacherEmail,
          isJufoParticipant: formValues.isJufoParticipant,
          projectMemberCount: formValues.projectMemberCount,
          languages: formValues.languages,
          learningGermanSince: formValues.learningGermanSince,
        });
        if (isTutee) {
          if (isCoDuSubdomain) {
            setRequestsAutoMatch(true);
            setFormState('finish');
          } else {
            setFormState('autoMatchChooser');
          }
        } else {
          // skip auto match view if user hasn't signed up for tutoring
          setFormState('finish');
        }
      }

      if (formState === 'autoMatchChooser') {
        setFormState('finish');
      }

      if (formState === 'finish') {
        const data = {
          ...formData,
          newsletter: formValues.newsletter?.includes('newsletter') || false,
        };
        console.log(data);

        setFormData(data);
        register(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderFormItems = () => {
    if (formState === 'start') {
      return renderStart();
    }
    if (formState === 'detail') {
      return renderDetail();
    }
    if (formState === 'autoMatchChooser') {
      return (
        <AutoMatchChooser
          setRequestsAutoMatch={setRequestsAutoMatch}
          nextStep={nextStep}
        />
      );
    }
    if (formState === 'finish') {
      return renderFinish();
    }
    if (formState === 'done') {
      return renderDone();
    }

    return renderStart();
  };

  if (isDrehtuerSubdomain) {
    return <RegisterDrehtuerTutee />;
  }

  return (
    <div>
      {!cooperationMode && (
        <>
          <div className={classes.signupContainer}>
            <Title className={classes.tuteeTitle}>
              {formState === 'done' && (
                <span>Du wurdest erfolgreich als Schüler:in registriert</span>
              )}
              {formState === 'start' && <span>Schritt 1/3</span>}
              {formState === 'detail' && <span>Schritt 2/3</span>}
              {formState === 'finish' && <span>Schritt 3/3</span>}
            </Title>
          </div>

          <Form
            form={form}
            className={classes.formContainer}
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
          >
            {!loading ? (
              renderFormItems()
            ) : (
              <div className={classes.loadingContainer}>
                <ClipLoader size={100} color="#123abc" loading />
              </div>
            )}

            <div className={classes.buttonContainer}>
              {formState !== 'start' && formState !== 'done' && (
                <Button
                  onClick={back}
                  className={classes.backButton}
                  color="#4E6AE6"
                  backgroundColor="white"
                >
                  Zurück
                </Button>
              )}
              {formState !== 'autoMatchChooser' && formState !== 'done' && (
                <Button
                  onClick={nextStep}
                  className={classes.signupButton}
                  color="white"
                  backgroundColor="#4E6AE6"
                >
                  {formState === 'finish' && 'Registrieren'}
                  {formState === 'start' && 'Weiter'}
                  {formState === 'detail' && 'Weiter'}
                </Button>
              )}
            </div>
          </Form>
        </>
      )}
      {!!cooperationMode && (
        <>
          <SignupContainer shouldShowBackButton={!cooperationMode}>
            <div className={classes.signupContainer}>
              <a
                rel="noopener noreferrer"
                href="https://www.lern-fair.de/"
                target="_blank"
              >
                <Icons.Logo className={classes.logo} />
                {cooperationMode?.kind === 'SpecificStateCooperation' &&
                  cooperationMode.stateInfo.coatOfArms &&
                  React.createElement(cooperationMode.stateInfo.coatOfArms, {
                    className: classes.stateLogo,
                  })}
                <Title size="h2" bold>
                  Lern-Fair
                </Title>
              </a>
              <Title className={classes.tuteeTitle}>
                {formState === 'done' ? (
                  <span>Du wurdest erfolgreich als Schüler:in registriert</span>
                ) : (
                  <span>
                    Ich möchte mich registrieren als <b>Schüler:in</b>
                  </span>
                )}
              </Title>
            </div>

            <Form
              form={form}
              className={classes.formContainer}
              layout="vertical"
              name="basic"
              initialValues={{ remember: true }}
            >
              {!loading ? (
                renderFormItems()
              ) : (
                <div className={classes.loadingContainer}>
                  <ClipLoader size={100} color="#123abc" loading />
                </div>
              )}

              <div className={classes.buttonContainer}>
                {formState !== 'start' && formState !== 'done' && (
                  <Button
                    onClick={back}
                    className={classes.backButton}
                    color="#4E6AE6"
                    backgroundColor="white"
                  >
                    Zurück
                  </Button>
                )}
                {formState !== 'autoMatchChooser' && formState !== 'done' && (
                  <Button
                    onClick={nextStep}
                    className={classes.signupButton}
                    color="white"
                    backgroundColor="#4E6AE6"
                  >
                    {formState === 'finish' && 'Registrieren'}
                    {formState === 'start' && 'Weiter'}
                    {formState === 'detail' && 'Weiter'}
                  </Button>
                )}
              </div>
            </Form>
            <Text className={classes.helpText}>
              Du hast schon einen Account? Hier{' '}
              <Link style={{ color: '#4e6ae6' }} to="/login">
                anmelden
              </Link>
              .
            </Text>
          </SignupContainer>
        </>
      )}
    </div>
  );
};

export default RegisterTutee;
