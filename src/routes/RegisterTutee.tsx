import React, { useState, useContext } from 'react';
import { Form, Input, Checkbox, Select, message } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { useHistory, Link, useLocation } from 'react-router-dom';
import Icons from '../assets/icons';
import SignupContainer from '../components/container/SignupContainer';
import { Title, Text } from '../components/Typography';
import Button from '../components/button';

import classes from './RegisterTutee.module.scss';
import { Subject } from '../types';
import Context from '../context';
import { SchoolInfo, Tutee } from '../types/Registration';
import { StateCooperationInfo } from '../assets/supportedStateCooperations';
import { emailDomainIsEqual } from '../utils/EmailUtils';

const { Option } = Select;

interface FormData {
  // start
  firstname?: string;
  lastname?: string;
  email?: string;
  grade?: number;
  isTutee?: boolean;
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
}

const RegisterTutee: React.FC<Props> = ({ stateCooperationInfo }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<
    'start' | 'detail' | 'finnish' | 'done'
  >('start');
  const [isTutee, setTutee] = useState(false);
  const [isGroups, setGroups] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [form] = Form.useForm();
  const [understoodHint, setUnderstoodHint] = useState<boolean>(false);
  const apiContext = useContext(Context.Api);

  const redirectTo = useQuery().get('redirectTo');

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo[]>(null);

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

  const renderStart = () => {
    return (
      <>
        <div className={classes.formContainerGroup}>
          <Form.Item
            className={classes.formItem}
            label="Vorname"
            name="firstname"
            rules={[
              { required: true, message: 'Bitte trage deinen Vornamen ein' },
            ]}
            initialValue={formData.firstname}
          >
            <Input placeholder="Max" />
          </Form.Item>
          <Form.Item
            className={classes.formItem}
            label="Nachname"
            name="lastname"
            rules={[
              { required: true, message: 'Bitte trage deinen Nachnamen ein' },
            ]}
            initialValue={formData.lastname}
          >
            <Input placeholder="Mustermann" />
          </Form.Item>
        </div>

        <Form.Item
          className={classes.formItem}
          label="E-Mail"
          name="email"
          initialValue={formData.email}
          rules={[
            { required: true, message: 'Bitte trage deine E-Mail ein!' },
            {
              type: 'email',
              message: 'Bitte trage eine gültige E-Mail ein!',
              validateTrigger: 'onSubmit',
            },
          ]}
        >
          <Input type="email" placeholder="max.musterman@email.com" />
        </Form.Item>

        <Form.Item
          className={classes.formItem}
          name="additional"
          label="Wie können wir dir helfen?"
          rules={[
            () => ({
              validator() {
                if (isGroups || isTutee) {
                  return Promise.resolve();
                }
                return Promise.reject('Bitte wähle eine Option aus.');
              },
            }),
          ]}
        >
          <Checkbox
            onChange={() => {
              setTutee(!isTutee);
            }}
            style={{ lineHeight: '32px', marginLeft: '8px' }}
            checked={isTutee}
            defaultChecked={formData.isTutee}
          >
            Ich möchte Unterstützung im 1-zu-1-Format von einem/einer Student*in
            erhalten.
          </Checkbox>
          {!understoodHint && isTutee && (
            <div className={classes.registrationHint}>
              <Title size="h5" bold>
                Hinweis zur Registrierung
              </Title>
              <Text>
                Dieses Angebot richtet sich an Schül;er*innen, die eine
                individuelle Lernunterstützung aufgrund persönlicher, sozialer
                oder finanzieller Ressourcen nicht oder nur schwer wahrnehmen
                können. Unsere anderen Angebote stehen hingegen für alle
                Schüler*innen offen.
              </Text>
              <Button
                className={classes.understoodButton}
                onClick={() => setUnderstoodHint(true)}
              >
                Verstanden
              </Button>
            </div>
          )}
          <Checkbox
            onChange={() => {
              setGroups(!isGroups);
            }}
            value="isGroups"
            style={{ lineHeight: '32px' }}
            checked={isGroups}
          >
            Ich möchte an Gruppenkursen der Corona School teilnehmen (z.B.
            Sommer-AG, Repetitorium, Lerncoaching)
          </Checkbox>
        </Form.Item>
      </>
    );
  };

  const renderDetail = () => {
    return (
      <>
        {!stateCooperationInfo && (
          <Form.Item
            className={classes.formItem}
            label="Schulform"
            name="school"
            rules={[
              { required: true, message: 'Bitte trage deine Schulform ein' },
            ]}
            initialValue={formData.school}
          >
            <Select placeholder="Grundschule..">
              <Option value="Grundschule">Grundschule</Option>
              <Option value="Gesamtschule">Gesamtschule</Option>
              <Option value="Hauptschule">Hauptschule</Option>
              <Option value="Realschule">Realschule</Option>
              <Option value="Gymnasium">Gymnasium</Option>
              <Option value="Förderschule">Förderschule</Option>
              <Option value="other">Sonstige</Option>
            </Select>
          </Form.Item>
        )}
        <Form.Item
          className={classes.formItem}
          label="Bundesland"
          name="state"
          rules={[
            { required: true, message: 'Bitte trage dein Bundesland ein' },
          ]}
          initialValue={
            stateCooperationInfo?.abbrev.toUpperCase() ?? formData.state
          }
        >
          <Select
            disabled={!!stateCooperationInfo}
            placeholder="Baden-Württemberg"
          >
            <Option value="BW"> Baden-Württemberg</Option>
            <Option value="BY"> Bayern</Option>
            <Option value="BE"> Berlin</Option>
            <Option value="BB"> Brandenburg</Option>
            <Option value="HB"> Bremen</Option>
            <Option value="HH"> Hamburg</Option>
            <Option value="HE"> Hessen</Option>
            <Option value="MV"> Mecklenburg-Vorpommern</Option>
            <Option value="NI"> Niedersachsen</Option>
            <Option value="NW"> Nordrhein-Westfalen</Option>
            <Option value="RP"> Rheinland-Pfalz</Option>
            <Option value="SL"> Saarland</Option>
            <Option value="SN"> Sachsen</Option>
            <Option value="ST"> Sachsen-Anhalt</Option>
            <Option value="SH"> Schleswig-Holstein</Option>
            <Option value="TH"> Thüringen</Option>
            <Option value="other">anderes Bundesland</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className={classes.formItem}
          label="Klasse"
          name="grade"
          rules={[{ required: true, message: 'Bitte trage deine Klasse ein!' }]}
          initialValue={formData.grade ? `${formData.grade}` : undefined}
        >
          <Select placeholder="Bitte wähle deine Klasse aus">
            <Option value="1">1. Klasse</Option>
            <Option value="2">2. Klasse</Option>
            <Option value="3">3. Klasse</Option>
            <Option value="4">4. Klasse</Option>
            <Option value="5">5. Klasse</Option>
            <Option value="6">6. Klasse</Option>
            <Option value="7">7. Klasse</Option>
            <Option value="8">8. Klasse</Option>
            <Option value="9">9. Klasse</Option>
            <Option value="10">10. Klasse</Option>
            <Option value="11">11. Klasse</Option>
            <Option value="12">12. Klasse</Option>
            <Option value="13">13. Klasse</Option>
          </Select>
        </Form.Item>
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
            label="E-Mail Lehrer*in"
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
              placeholder="Hier die E-Mail deines/deiner Lehrer*in"
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
        <Form.Item
          className={classes.formItem}
          label="Datenschutzerklärung"
          name="dataprotection"
          rules={[
            {
              required: true,
              message: 'Bitte akzeptiere die Datenschutzerklärung',
            },
          ]}
        >
          <Checkbox.Group className={classes.checkboxGroup}>
            <Checkbox value="dataprotection">
              Ich habe die{' '}
              <a
                href="https://www.corona-school.de/datenschutz"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzerklärung
              </a>{' '}
              des Corona School e.V. zur Kenntnis genommen und willige in die
              Verarbeitung personenbezogener Daten zu den angegebenen Zwecken
              ein. Mir ist insbesondere bekannt, dass meine Angaben an geeignete
              Lernpartner*innen übermittelt werden. Die Verarbeitung der
              personenbezogenen Daten erfolgt auf privaten IT-Geräten der
              Lernpartner*innen. Es kann im Rahmen der Übermittlung dazu kommen,
              dass personenbezogene Daten an E-Mail Server (bspw. google-mail
              oder @me.com) außerhalb der Europäischen Union übermittelt werden.
              In Ländern außerhalb der Europäischen Union besteht ggf. kein
              adäquates Datenschutzniveau. Zudem kann die Durchsetzung von
              Rechten erschwert bzw. ausgeschlossen sein. Mir sind diese Risiken
              bewusst und bekannt.
              <br />
              Mir ist außerdem bekannt, dass meine Einwilligung freiwillig und
              jederzeit mit Wirkung für die Zukunft widerruflich ist. Ein
              Widerruf der Einwilligung kann formlos erfolgen (beispielsweise an{' '}
              <a href="mailto:datenschutz@corona-school.de">
                datenschutz@corona-school.de
              </a>
              ). Mir ist bewusst, dass der Widerruf nur für die Zukunft gilt und
              daher Datenverarbeitungen bis zum Widerruf, insbesondere die
              Weitergabe von meinen personenbezogenen Daten an geeignete
              Lernpartner*innen bis zum Zeitpunkt des Widerrufs unberührt
              bleiben. Weitere Datenschutzinformationen sind abrufbar unter{' '}
              <a
                href="https://www.corona-school.de/datenschutz"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.corona-school.de/datenschutz
              </a>
              .
              <br />
              <br />
              <span style={{ fontWeight: 'bold' }}>Hinweis:</span>{' '}
              <span style={{ fontStyle: 'italic' }}>
                Für den Fall, dass die einwilligende Person noch nicht 18 Jahre
                alt ist, hat der Träger der elterlichen Verantwortung für die
                Person die Einwilligung zu erklären.
              </span>
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>
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
      !data.grade ||
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
        if (!understoodHint && isTutee) {
          message.error('Bitte bestätige den Hinweis zur Registrierung');
          return;
        }

        setFormData({
          ...formData,
          firstname: formValues.firstname,
          lastname: formValues.lastname,
          email: formValues.email,
          isTutee,
        });

        setFormState('detail');
      }
      if (formState === 'detail') {
        setFormData({
          ...formData,
          state: formValues.state,
          school: formValues.school,

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
