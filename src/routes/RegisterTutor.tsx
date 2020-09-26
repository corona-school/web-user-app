import React, { useState, useContext } from 'react';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { Form, Input, Checkbox, InputNumber, Select, message } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import Icons from '../assets/icons';
import SignupContainer from '../components/container/SignupContainer';
import { Title, Text } from '../components/Typography';
import Button from '../components/button';
import { Subject } from '../types';
import Context from '../context';
import { Tutor } from '../types/Registration';

import classes from './RegisterTutor.module.scss';

const { Option } = Select;

interface FormData {
  // start
  firstname?: string;
  lastname?: string;
  email?: string;
  isOfficial?: boolean;
  isInstructor?: boolean;
  isTutor?: boolean;
  // isOfficial
  state?: string;
  university?: string;
  module?: 'internship' | 'seminar' | 'other';
  hours?: number;
  // isTutor
  subjects?: Subject[];
  // finnish
  msg?: string;
  newsletter?: boolean;
}

interface Props {
  isInternship?: boolean;
  isClub?: boolean;
  isStudent?: boolean;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const RegisterTutor: React.FC<Props> = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [isOfficial, setOfficial] = useState(props.isInternship || false);
  const [isTutor, setTutor] = useState(
    props.isStudent || props.isInternship || false
  );
  const [isGroups, setGroups] = useState(
    props.isInternship || props.isClub || false
  );
  const [formState, setFormState] = useState<
    'start' | 'detail' | 'finnish' | 'done'
  >('start');
  const [formData, setFormData] = useState<FormData>({});
  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

  const redirectTo = useQuery().get('redirectTo');

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
          >
            <Input placeholder="Max" defaultValue={formData.firstname} />
          </Form.Item>
          <Form.Item
            className={classes.formItem}
            label="Nachname"
            name="lastname"
            rules={[
              { required: true, message: 'Bitte trage deinen Nachnamen ein' },
            ]}
          >
            <Input placeholder="Mustermann" defaultValue={formData.lastname} />
          </Form.Item>
        </div>

        <Form.Item
          className={classes.formItem}
          label="Uni E-Mail"
          name="email"
          rules={[
            { required: true, message: 'Bitte trage deine Uni-E-Mail ein!' },
            {
              type: 'email',
              message: 'Bitte trage eine gültige E-Mail ein!',
              validateTrigger: 'onSubmit',
            },
          ]}
        >
          <Input
            type="email"
            placeholder="max.musterman@email.com"
            defaultValue={formData.email}
          />
        </Form.Item>

        <Form.Item
          className={classes.formItem}
          name="additional"
          label="Auf welche Art möchtest du Schüler*innen unterstützen?"
          rules={[
            () => ({
              required: true,
              validator() {
                if (isGroups || isTutor) {
                  return Promise.resolve();
                }
                return Promise.reject('Bitte wähle eine Option aus.');
              },
            }),
          ]}
        >
          <Checkbox
            onChange={() => {
              if (props.isInternship) {
                return;
              }
              setTutor(!isTutor);
            }}
            value="isTutor"
            style={{ lineHeight: '32px', marginLeft: '8px' }}
            checked={isTutor}
          >
            Ich möchte eine*n Schüler*in im 1-zu-1-Format unterstützen
          </Checkbox>
          <Checkbox
            onChange={() => {
              if (props.isInternship) {
                return;
              }
              setGroups(!isGroups);
            }}
            value="isGroups"
            style={{ lineHeight: '32px' }}
            checked={isGroups}
          >
            Ich möchte einen Gruppenkurs in der Corona School anbieten (z.B.
            Sommer-AG, Repetitorium, Lerncoaching)
          </Checkbox>
        </Form.Item>
        <Form.Item
          className={classes.formItem}
          name="official"
          label={
            <span>
              Für Lehramtsstudierende: Möchtest du dich für unser{' '}
              <a
                href="https://www.corona-school.de/digital-lehren-lernen"
                rel="noopener noreferrer"
                target="_blank"
              >
                digitales Praktikum
              </a>{' '}
              anmelden?
            </span>
          }
          rules={[
            () => ({
              required: props.isInternship,
              validator() {
                if ((!isGroups || !isTutor) && isOfficial) {
                  return Promise.reject(
                    'Um am Praktikum teilzunehmen, musst du sowohl Schüler*innen im 1-zu-1-Format als auch in Gruppenkursen helfen.'
                  );
                }
                if (!props.isInternship) {
                  return Promise.resolve();
                }
                if (props.isInternship && isOfficial) {
                  return Promise.resolve();
                }
                return Promise.reject('Bitte wähle eine Option aus.');
              },
            }),
          ]}
        >
          <Checkbox
            onChange={() => {
              setOfficial(!isOfficial);
            }}
            style={{ lineHeight: '32px', marginLeft: '8px' }}
            checked={isOfficial}
          >
            Ja
          </Checkbox>
        </Form.Item>
      </>
    );
  };
  const renderDetail = () => {
    return (
      <>
        {isOfficial && (
          <Form.Item
            className={classes.formItem}
            label="Derzeitiges Bundesland"
            name="state"
            rules={[
              { required: true, message: 'Bitte trage dein Bundesland ein' },
            ]}
          >
            <Select
              showSearch
              placeholder="Baden-Württemberg"
              defaultValue={formData.state}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="BW">Baden-Württemberg</Option>
              <Option value="BY">Bayern</Option>
              <Option value="BE">Berlin</Option>
              <Option value="BB">Brandenburg</Option>
              <Option value="HB">Bremen</Option>
              <Option value="HH">Hamburg</Option>
              <Option value="HE">Hessen</Option>
              <Option value="MV">Mecklenburg-Vorpommern</Option>
              <Option value="NI">Niedersachsen</Option>
              <Option value="NW">Nordrhein-Westfalen</Option>
              <Option value="RP">Rheinland-Pfalz</Option>
              <Option value="SL">Saarland</Option>
              <Option value="SN">Sachsen</Option>
              <Option value="ST">Sachsen-Anhalt</Option>
              <Option value="SH">Schleswig-Holstein</Option>
              <Option value="TH">Thüringen</Option>
              <Option value="other">anderes Bundesland</Option>
            </Select>
          </Form.Item>
        )}
        {isTutor && (
          <Form.Item
            className={classes.formItem}
            label="In welchen Fächern kannst du Schüler*innen unterstützen? "
            name="subjects"
            rules={[
              {
                required: true,
                message: 'Bitte trage deine Fächer ein',
              },
            ]}
          >
            <Select
              mode="multiple"
              defaultValue={
                formData.subjects
                  ? formData.subjects.map((s) => s.name)
                  : undefined
              }
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

        {isOfficial && (
          <Form.Item
            className={classes.formItem}
            label="Universität/Hochschule"
            name="university"
            rules={[
              { required: true, message: 'Bitte trage deine Universität ein' },
            ]}
          >
            <Input
              placeholder="Duale Hochschule Musterstadt"
              defaultValue={formData.university}
            />
          </Form.Item>
        )}

        {isOfficial && (
          <Form.Item
            className={classes.formItem}
            label="Aufwand des Moduls (in Stunden)"
            name="hours"
            rules={[
              {
                required: true,
                message: 'Bitte trage dein zeitlichen Aufwand ein',
              },
            ]}
          >
            <InputNumber
              placeholder="40h"
              min={1}
              max={500}
              defaultValue={formData.hours}
            />
          </Form.Item>
        )}
        <Form.Item
          className={classes.formItem}
          label={
            isGroups
              ? 'Beschreibe die Inhalte deines Gruppenkurses bzw. deiner Gruppenkurse (3-5 Sätze)'
              : 'Nachricht hinzufügen'
          }
          name="msg"
        >
          <Input.TextArea
            autoSize={{ minRows: isGroups ? 6 : 4 }}
            placeholder={
              isGroups
                ? 'Kursthema, Zielgruppe, Kursgröße, Interaktion'
                : 'Hier deine Nachricht für uns.'
            }
          />
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
              Ich möchte über weitere Aktionen, Angebote und
              Unterstützungsmöglichkeiten der Corona School per E-Mail
              informiert werden. Dazu gehören Möglichkeiten zur Vernetzung mit
              anderen registrierten Studierenden, Mentoring und Nachrichten aus
              dem Organisationsteam.
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
        <Title className={classes.loginTitle} size="h4">
          Wir haben dir eine E-Mail geschickt.
        </Title>
        <Icons.SignupEmailSent />
      </div>
    );
  };
  const mapFormDataToTutor = (data: FormData): Tutor | null => {
    if (!data.firstname || !data.lastname || !data.email) {
      return null;
    }
    return {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email.toLowerCase(),
      isTutor: data.isTutor,
      subjects: data.subjects || [],
      isOfficial: data.isOfficial,
      isInstructor: data.isInstructor,
      university: data.university,
      module: data.module,
      hours: data.hours,
      newsletter: !!data.newsletter,
      msg: data.msg || '',
      state: data.state?.toLowerCase(),
      redirectTo,
    };
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
    if (formState === 'detail') {
      setFormState('start');
    }
    if (formState === 'finnish') {
      setFormState('detail');
    }

    if (formState === 'done') {
      setFormState('start');
    }
  };

  const register = (data: FormData) => {
    const tutor = mapFormDataToTutor(data);
    if (!tutor) {
      message.error('Es ist ein Fehler aufgetreten.');
      return;
    }

    setLoading(true);
    apiContext
      .registerTutor(tutor)
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
          hours: undefined,
          module: undefined,
        });
        setOfficial(false);
        setTutor(false);
        form.resetFields();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setLoading(false);
          message.error('Du bist schon als Tutor*in bei uns eingetragen.');
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

      if (formState === 'start') {
        setFormData({
          ...formData,
          firstname: formValues.firstname,
          lastname: formValues.lastname,
          email: formValues.email,
          isOfficial,
          isTutor,
          isInstructor: isGroups,
        });

        setFormState('detail');
      }
      if (formState === 'detail') {
        setFormData({
          ...formData,
          subjects: isTutor
            ? formValues.subjects.map((s) => ({
                name: s,
                minGrade: 1,
                maxGrade: 13,
              }))
            : undefined,
          msg: formValues.msg,
          state: formValues.state,
          university: formValues.university,
          module: 'internship',
          hours: formValues.hours,
        });
        setFormState('finnish');
      }
      if (formState === 'finnish') {
        const data = {
          ...formData,
          newsletter: formValues.newsletter?.includes('newsletter'),
        };
        setFormData(data);
        register(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SignupContainer>
      <div className={classes.signupContainer}>
        <a
          rel="noopener noreferrer"
          href="https://www.corona-school.de/"
          target="_blank"
        >
          <Icons.Logo className={classes.logo} />
          <Title size="h2" bold>
            Corona School
          </Title>
        </a>
        {/* <Title>
          {formState === 'done' ? (
            <span>Du wurdest erfolgreich als Tutor*in registriert</span>
          ) : (
            <span>
              Ich möchte mich registrieren als <b>Tutor*in</b>
            </span>
          )}
        </Title> */}
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
            {(formState === 'start' || formState === 'detail') && 'Weiter'}
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

export default RegisterTutor;
