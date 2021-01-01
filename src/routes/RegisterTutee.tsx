import React, { useState, useContext } from 'react';
import {
  Form,
  Input,
  Checkbox,
  Select,
  message,
  Radio,
  InputNumber,
} from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { useHistory, Link, useLocation } from 'react-router-dom';
import Icons from '../assets/icons';
import SignupContainer from '../components/container/SignupContainer';
import { Title, Text, LinkText } from '../components/Typography';
import Button from '../components/button';

import classes from './RegisterTutee.module.scss';
import { Subject } from '../types';
import Context from '../context';
import { SchoolInfo, Tutee } from '../types/Registration';
import { StateCooperationInfo } from '../assets/supportedStateCooperations';
import { emailDomainIsEqual } from '../utils/EmailUtils';
import { RegisterDrehtuerTutee } from './RegisterDrehtuerTutee';
import {
  DataProtectionField,
  EmailField,
  GradeField,
  NameField,
  SchoolKindField,
  StateField,
} from '../components/forms/registration';

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
  // finnish
  state?: string;
  school?: string;
  msg?: string;
  newsletter?: boolean;
  teacherEmail?: string;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

interface Props {
  stateCooperationInfo?: StateCooperationInfo;
  isJufoSubdomain?: boolean;
  isDrehtuerSubdomain?: boolean;
}

const RegisterTutee: React.FC<Props> = ({
  stateCooperationInfo,
  isJufoSubdomain,
  isDrehtuerSubdomain,
}) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<
    'start' | 'detail' | 'finnish' | 'done'
  >('start');
  const [isTutee, setTutee] = useState(false);
  const [isGroups, setGroups] = useState(false);
  const [isJufo, setJufo] = useState(isJufoSubdomain ?? false);

  const [formData, setFormData] = useState<FormData>({});
  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

  const redirectTo = useQuery().get('redirectTo');

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo[]>(null);

  const isOnlyJufo = isJufo && !isTutee && !isGroups;

  if (stateCooperationInfo && !loading && schoolInfo == null) {
    // load school info
    setLoading(true);
    apiContext
      .getCooperatingSchools(stateCooperationInfo.abbrev)
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
        >
          Ich möchte{' '}
          <LinkText
            text="Lernunterstützung im 1:1-Format"
            href="https://www.corona-school.de/1-zu-1-lernbetreuung"
            enableLink={isJufoSubdomain}
          />{' '}
          von einem/einer Student*in erhalten.
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
        disabled={isJufoSubdomain}
        onChange={() => {
          setJufo(!isJufo);
        }}
        value="isJufo"
        style={{ lineHeight: '32px', marginLeft: '8px' }}
        className={isJufoSubdomain ? classes.disabledCheckbox : undefined}
        checked={isJufo}
      >
        Ich suche Unterstützung bei der Erarbeitung meines (Forschungs-)Projekts
        (z.{' '}B. im Rahmen einer Teilnahme an{' '}
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
          {renderIsTuteeCheckbox()}
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
        {!stateCooperationInfo && (
          <SchoolKindField
            isJufo={isJufo}
            className={classes.formItem}
            defaultSchoolKind={formData.school}
          />
        )}
        <StateField
          className={classes.formItem}
          defaultState={
            stateCooperationInfo?.abbrev.toUpperCase() ?? formData.state
          }
          disabled={!!stateCooperationInfo}
        />
        <GradeField
          className={classes.formItem}
          defaultGrade={formData.grade ? `${formData.grade}` : undefined}
          emptyOption={isOnlyJufo && !stateCooperationInfo}
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
          >
            <Select
              mode="multiple"
              placeholder="Bitte, wähle deine Fächer aus."
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
              <Option value="Mathematik">Mathematik</Option>
              <Option value="Biologie">Biologie</Option>
              <Option value="Physik">Physik</Option>
              <Option value="Chemie">Chemie</Option>
              <Option value="Informatik">Informatik</Option>
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
        {!!stateCooperationInfo && (
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
                      .map((s) => s.emailDomain)
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
        <Form.Item
          className={classes.formItem}
          label="Nachricht"
          name="msg"
          initialValue={formData.msg}
        >
          <Input.TextArea placeholder="Hier deine Nachricht" />
        </Form.Item>
      </>
    );
  };

  const renderFinnish = () => {
    return (
      <>
        <Form.Item
          className={classes.formItem}
          label="Newsletter"
          name="newsletter"
        >
          <Checkbox.Group className={classes.checkboxGroup}>
            <Checkbox value="newsletter" defaultChecked={formData.newsletter}>
              Ich möchte den Newsletter der Corona School erhalten und über
              Angebote, Aktionen und weitere Unterstützungsmöglichkeiten per
              E-Mail informiert werden.
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>
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

    if (formState === 'finnish') {
      return renderFinnish();
    }
    if (formState === 'done') {
      return renderDone();
    }

    return renderStart();
  };

  const back = () => {
    if (formState === 'finnish') {
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
      !data.state
    ) {
      return null;
    }
    return {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email.toLowerCase(),
      isTutee: data.isTutee,
      subjects: data.subjects || [],
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

    const registerAPICall = stateCooperationInfo
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
        });
        setFormState('finnish');
      }

      if (formState === 'finnish') {
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
    <SignupContainer shouldShowBackButton={!stateCooperationInfo}>
      <div className={classes.signupContainer}>
        <a
          rel="noopener noreferrer"
          href="https://www.corona-school.de/"
          target="_blank"
        >
          <Icons.Logo className={classes.logo} />
          {stateCooperationInfo?.coatOfArms &&
            React.createElement(stateCooperationInfo.coatOfArms, {
              className: classes.stateLogo,
            })}
          <Title size="h2" bold>
            Corona School
          </Title>
        </a>
        <Title className={classes.tuteeTitle}>
          {formState === 'done' ? (
            <span>Du wurdest erfolgreich als Schüler*in registriert</span>
          ) : (
            <span>
              Ich möchte mich registrieren als <b>Schüler*in</b>
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
            {formState === 'finnish' && 'Registrieren'}
            {formState === 'start' && 'Weiter'}
            {formState === 'detail' && 'Weiter'}
            {formState === 'done' && 'Anmelden'}
          </Button>
        </div>
      </Form>
      <Text className={classes.helpText}>
        Du hast schon ein Account? Hier{' '}
        <Link style={{ color: '#4e6ae6' }} to="/login">
          anmelden
        </Link>
        .
      </Text>
    </SignupContainer>
  );
};

export default RegisterTutee;
