import React, { useState, useContext } from 'react';
import {
  Form,
  Input,
  Checkbox,
  Select,
  message,
  Radio,
  InputNumber,
  Tooltip,
} from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { useHistory, useLocation } from 'react-router-dom';
import Icons from '../assets/icons';
import { Title, Text, LinkText } from '../components/Typography';
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
import { languages } from '../assets/languages';
import { learningGermanSinceOptions } from '../assets/learningGermanSinceOptions';

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
  languages?: typeof languages[number][];
  learningGermanSince?: string;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
interface Props {
  cooperationMode?: CooperationMode;
  isJufoSubdomain?: boolean;
  isDrehtuerSubdomain?: boolean;
}

const RegisterTutee: React.FC<Props> = ({
  cooperationMode,
  isJufoSubdomain,
  isDrehtuerSubdomain,
}) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<
    'start' | 'detail' | 'finish' | 'done'
  >('start');
  const [isTutee, setTutee] = useState(false);
  const [isGroups, setGroups] = useState(false);
  const [isJufo, setJufo] = useState(isJufoSubdomain ?? false);

  const [isGermanNative, setIsGermanNative] = useState<boolean>(true);
  const [dazOnly, setDazOnly] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({});
  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

  const redirectTo = useQuery().get('redirectTo');

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo[]>(null);

  const isOnlyJufo = isJufo && !isTutee && !isGroups;

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

  const DisabledExplanation = () => {
    return (
      <Tooltip title="Du kannst dich nicht gleichzeitig für die 1:1-Lernunterstützung und das 1:1-Projektcoaching anmelden.">
        <Icons.Help fill="grey" />
      </Tooltip>
    );
  };

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

  const renderIsTuteeCheckbox = () => {
    return (
      <>
        <Checkbox
          onChange={() => {
            setTutee(!isTutee);
          }}
          style={{ lineHeight: '32px', marginLeft: '8px' }}
          checked={isTutee}
          defaultChecked={formData.isTutee}
          disabled={isJufo}
        >
          <>
            Ich möchte{' '}
            <LinkText
              text="Lernunterstützung im 1:1-Format"
              href="https://www.corona-school.de/1-zu-1-lernbetreuung"
              enableLink={isJufoSubdomain}
            />{' '}
            von einem/einer Student*in erhalten.
          </>
          {isJufo && <DisabledExplanation />}
        </Checkbox>
        {isTutee && (
          <div className={classes.registrationHint}>
            <Title size="h5" bold>
              Hinweis bei der Registrierung
            </Title>
            <Text>
              Bitte melde dich nur an, wenn du individuelle Unterstützung beim
              Lernen aus persönlichen, sozialen, kulturellen oder finanziellen
              Gründen nicht oder nur schwer wahrnehmen kannst. Unsere anderen
              Angebote stehen weiterhin für alle Schüler*innen offen.
            </Text>
          </div>
        )}
      </>
    );
  };

  const renderIsGroupsCheckbox = () => {
    return (
      <Checkbox
        onChange={() => {
          setGroups(!isGroups);
        }}
        value="isGroups"
        style={{ lineHeight: '32px', marginLeft: '8px' }}
        checked={isGroups}
      >
        Ich möchte an{' '}
        <LinkText
          text="Gruppenkursen"
          href="https://www.corona-school.de/sommer-ags"
          enableLink={isJufoSubdomain}
        />{' '}
        der Corona School teilnehmen (z.{' '}B. Sommer-AG, Repetitorium,
        Lerncoaching).
      </Checkbox>
    );
  };

  const renderIsJufoCheckbox = () => {
    return (
      <Checkbox
        disabled={isJufoSubdomain || isTutee}
        onChange={() => {
          setJufo(!isJufo);
        }}
        value="isJufo"
        style={{ lineHeight: '32px', marginLeft: '8px' }}
        className={isJufoSubdomain ? classes.disabledCheckbox : undefined}
        checked={isJufo}
      >
        <>
          Ich suche Unterstützung bei der Erarbeitung meines
          (Forschungs-)Projekts (z.{' '}B. im Rahmen einer Teilnahme an{' '}
          <span style={{ fontWeight: isJufoSubdomain ? 'bolder' : 'normal' }}>
            Jugend forscht
          </span>
          ) und möchte am{' '}
          <LinkText
            text="1:1-Projektcoaching"
            href="https://www.corona-school.de/1-zu-1-projektcoaching"
            enableLink={isJufoSubdomain}
          />{' '}
          teilnehmen.
        </>
        {isTutee && <DisabledExplanation />}
      </Checkbox>
    );
  };

  const renderOfferPickerForJufo = () => {
    return (
      <>
        <Form.Item
          className={classes.formItem}
          name="jufoDefault"
          rules={[
            () => ({
              validator() {
                if (isJufo) {
                  return Promise.resolve();
                }
                return Promise.reject('Bitte wähle eine Option aus.');
              },
            }),
          ]}
        >
          {renderIsJufoCheckbox()}
        </Form.Item>
        <Form.Item
          className={classes.formItem}
          name="additional"
          label={
            <span style={{ fontWeight: 'bold' }}>
              Wobei können wir dir noch helfen?
            </span>
          }
          style={{ marginTop: '30px' }}
          extra={
            <div style={{ marginLeft: '8px' }}>
              Neben individueller Unterstützung bei der Erarbeitung eines
              Projekts, besteht die Möglichkeit, dass du dich zusätzlich noch
              für weitere Angebote anmeldest.
            </div>
          }
        >
          {renderIsGroupsCheckbox()}
        </Form.Item>
      </>
    );
  };

  const renderOfferPickerNormal = () => {
    return (
      <Form.Item
        className={classes.formItem}
        name="additional"
        label="Wie können wir dir helfen?"
        rules={[
          () => ({
            validator() {
              if (isGroups || isTutee || isJufo) {
                return Promise.resolve();
              }
              return Promise.reject('Bitte wähle eine Option aus.');
            },
          }),
        ]}
      >
        {renderIsTuteeCheckbox()}
        {renderIsGroupsCheckbox()}
        {renderIsJufoCheckbox()}
      </Form.Item>
    );
  };

  const renderStart = () => {
    return (
      <>
        <NameField
          firstname={formData.firstname}
          lastname={formData.lastname}
          className={classes.formItem}
        />

        <EmailField
          initialValue={formData.email}
          className={classes.formItem}
        />

        {(isJufoSubdomain && renderOfferPickerForJufo()) ||
          renderOfferPickerNormal()}
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

        {cooperationMode?.kind !== 'GeneralSchoolCooperation' && (
          <StateField
            className={classes.formItem}
            defaultState={
              cooperationMode?.stateInfo?.abbrev.toUpperCase() ?? formData.state
            }
            disabled={!!cooperationMode}
          />
        )}
        <GradeField
          className={classes.formItem}
          defaultGrade={formData.grade ? `${formData.grade}` : undefined}
          emptyOption={isOnlyJufo && !cooperationMode}
          allowEverything={isOnlyJufo}
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
            extra="Hinweis für Gruppen: Es muss sich nur euer*e Gruppensprecher*in anmelden, wenn ihr als Team teilnehmen möchtet."
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
              {languages.map((l) => (
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
            Deutschnkentnisse zu verbessern. Aus diesem Grund kannst du zum
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
            label="E-Mail-Adresse Lehrer*in"
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
          >
            <Input
              placeholder="Hier die E-Mail-Adresse deines/deiner Lehrer*in"
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
        <DataProtectionField className={classes.formItem} />
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

  const renderFormItems = () => {
    if (formState === 'start') {
      return renderStart();
    }
    if (formState === 'detail') {
      return renderDetail();
    }

    if (formState === 'finish') {
      return renderFinish();
    }
    if (formState === 'done') {
      return renderDone();
    }

    return renderStart();
  };

  const back = () => {
    if (formState === 'finish') {
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
    if (
      !data.firstname ||
      !data.lastname ||
      !data.email ||
      (!data.grade && !isOnlyJufo) ||
      (!data.state &&
        (!cooperationMode ||
          cooperationMode.kind === 'SpecificStateCooperation'))
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
      isTutee: data.isTutee,
      subjects: subjects || [],
      grade: data.grade,
      school: data.school?.toLowerCase(),
      state: data.state?.toLowerCase(),
      isProjectCoachee: data.isJufo,
      isJufoParticipant: data.isJufoParticipant,
      projectFields: data.project,
      projectMemberCount: data.projectMemberCount,
      newsletter: !!data.newsletter,
      msg: data.msg || '',
      teacherEmail: data.teacherEmail,
      languages: data.languages || [],
      learningGermanSince: data.learningGermanSince,
      redirectTo,
    };
  };

  const register = (data: FormData) => {
    const tutee = mapFormDataToTutee(data);
    if (!tutee) {
      message.error('Es ist ein Fehler aufgetreten.');
      return;
    }
    console.log(tutee);

    const registerAPICall = cooperationMode
      ? apiContext.registerStateTutee
      : apiContext.registerTutee;

    setLoading(true);
    registerAPICall(tutee)
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
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setLoading(false);
          message.error('Du bist schon als Schüler*in bei uns eingetragen.');
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

  if (isDrehtuerSubdomain) {
    return <RegisterDrehtuerTutee />;
  }

  return (
    <div>
      <div className={classes.signupContainer}>
        <Title className={classes.tuteeTitle}>
          {formState === 'done' && (
            <span>Du wurdest erfolgreich als Schüler*in registriert</span>
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
          {formState !== 'start' && (
            <Button
              onClick={back}
              className={classes.backButton}
              color="#4E6AE6"
              backgroundColor="white"
            >
              Zurück
            </Button>
          )}
          <Button
            onClick={nextStep}
            className={classes.signupButton}
            color="white"
            backgroundColor="#4E6AE6"
          >
            {formState === 'finish' && 'Registrieren'}
            {formState === 'start' && 'Weiter'}
            {formState === 'detail' && 'Weiter'}
            {formState === 'done' && 'Anmelden'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterTutee;
