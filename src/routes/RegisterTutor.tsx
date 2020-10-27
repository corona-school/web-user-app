import React, { useState, useContext } from 'react';
import { useHistory, Link, useLocation } from 'react-router-dom';
import {
  Form,
  Input,
  Checkbox,
  InputNumber,
  Select,
  message,
  Radio,
} from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import Icons from '../assets/icons';
import SignupContainer from '../components/container/SignupContainer';
import { Title, Text, LinkText } from '../components/Typography';
import Button from '../components/button';
import { Subject } from '../types';
import Context from '../context';
import { Tutor } from '../types/Registration';

import classes from './RegisterTutor.module.scss';
import UniSelect from '../components/forms/select/UniSelect';

const { Option } = Select;

interface FormData {
  // start
  firstname?: string;
  lastname?: string;
  email?: string;
  isOfficial?: boolean;
  isInstructor?: boolean;
  isTutor?: boolean;
  isJufo?: boolean;
  // isJufo
  project?: string[];
  wasJufoParticipant?: 'yes' | 'no' | 'idk';
  isUniversityStudent?: 'yes' | 'no';
  hasJufoCertificate?: boolean;
  jufoPastParticipationInfo?: string;
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
  isJufoSubdomain?: boolean;
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
  const [isJufo, setJufo] = useState(props.isJufoSubdomain ?? false);
  const [wasJufoParticipant, setWasJufoParticipant] = useState(true);
  const [isUniversityStudent, setIsUniversityStudent] = useState(true);
  const [hasJufoCertificate, setHasJufoCertificate] = useState(false);
  const [formState, setFormState] = useState<
    'start' | 'detail' | 'finnish' | 'done'
  >('start');
  const [formData, setFormData] = useState<FormData>({});
  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

  const redirectTo = useQuery().get('redirectTo');

  const renderIsTutorCheckbox = () => {
    return (
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
        Ich möchte eine*n Schüler*in im{' '}
        <LinkText
          text="1:1-Format beim Lernen"
          href="https://www.corona-school.de/1-zu-1-lernbetreuung"
          enableLink={props.isJufoSubdomain}
        />{' '}
        unterstützen.
      </Checkbox>
    );
  };

  const renderIsGroupsCheckbox = () => {
    return (
      <Checkbox
        onChange={() => {
          if (props.isInternship) {
            return;
          }
          setGroups(!isGroups);
        }}
        value="isGroups"
        style={{ lineHeight: '32px', marginLeft: '8px' }}
        checked={isGroups}
      >
        Ich möchte einen{' '}
        <LinkText
          text="Gruppenkurs"
          href="https://www.corona-school.de/sommer-ags"
          enableLink={props.isJufoSubdomain}
        />{' '}
        in der Corona School anbieten (z.{' '}B. Sommer-AG, Repetitorium,
        Lerncoaching).
      </Checkbox>
    );
  };

  const renderIsJufoCheckbox = () => {
    return (
      <Checkbox
        disabled={props.isJufoSubdomain}
        onChange={() => {
          setJufo(!isJufo);
        }}
        value="isJufo"
        style={{ lineHeight: '32px', marginLeft: '8px' }}
        className={props.isJufoSubdomain ? classes.disabledCheckbox : undefined}
        checked={isJufo}
      >
        Ich möchte Schüler*innen im 1:1-Projektcoaching (z.{' '}B. im Rahmen von{' '}
        <span
          style={{ fontWeight: props.isJufoSubdomain ? 'bolder' : 'normal' }}
        >
          Jugend forscht
        </span>
        ) unterstützen.
      </Checkbox>
    );
  };

  const renderDLLFormItem = () => {
    return (
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
                  'Um am Praktikum teilzunehmen, musst du sowohl Schüler*innen im 1:1-Format beim Lernen als auch in Gruppenkursen helfen.'
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
              required: true,
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
          style={{ marginTop: '30px' }}
          name="additional"
          label={
            <span style={{ fontWeight: 'bold' }}>
              Möchtest du noch mehr helfen?
            </span>
          }
          extra={
            <div style={{ marginLeft: '8px' }}>
              Mit diesem zusätzlichem Engagement kannst du Schüler*innen
              ehrenamtlich über das 1:1-Projektcoaching hinaus unterstützen.
              Gruppenkurse erlauben es dir beispielsweise, einer ganzen Gruppe
              Wissen zu vermitteln.
            </div>
          }
        >
          {renderIsTutorCheckbox()}
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
        label="Auf welche Art möchtest du Schüler*innen unterstützen?"
        rules={[
          () => ({
            required: true,
            validator() {
              if (isGroups || isTutor || isJufo) {
                return Promise.resolve();
              }
              return Promise.reject('Bitte wähle eine Option aus.');
            },
          }),
        ]}
      >
        {renderIsTutorCheckbox()}
        {renderIsGroupsCheckbox()}
        {renderIsJufoCheckbox()}
      </Form.Item>
    );
  };

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
          label={isJufo && !isTutor ? 'E-Mail-Adresse' : 'Uni E-Mail-Adresse'}
          name="email"
          rules={[
            {
              required: true,
              message: 'Bitte trage deine (Uni-)E-Mail-Adresse ein!',
            },
            {
              type: 'email',
              message: 'Bitte trage eine gültige E-Mail-Adresse ein!',
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
        {(props.isJufoSubdomain && renderOfferPickerForJufo()) ||
          renderOfferPickerNormal()}
        {renderDLLFormItem()}
      </>
    );
  };
  const renderDetail = () => {
    return (
      <>
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
            <Option value="other">anderer Wohnort</Option>
          </Select>
        </Form.Item>
        {isJufo && (
          <Form.Item
            className={classes.formItem}
            label="Fachgebiet, in dem du ein Projekt unterstützen möchtest"
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
                  return Promise.resolve();
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
            label="Hast du früher an Jugend forscht teilgenommen?"
            name="wasJufoParticipant"
            rules={[
              {
                required: true,
                message: 'Bitte wähle eine Option aus.',
              },
            ]}
            initialValue={
              formData.wasJufoParticipant
                ? `${formData.wasJufoParticipant}`
                : 'yes'
            }
          >
            <Radio.Group
              onChange={(e) => {
                setWasJufoParticipant(e.target.value === 'yes');
              }}
            >
              <Radio.Button value="yes">Ja</Radio.Button>
              <Radio.Button value="no">Nein</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
        {isJufo && !isTutor && (
          <Form.Item
            className={classes.formItem}
            label="Bist du offiziell als Student*in eingeschrieben?"
            name="isUniversityStudent"
            rules={[
              {
                required: true,
                message: 'Bitte wähle eine Option aus.',
              },
              () => ({
                required: true,
                validateTrigger: 'onSubmit',
                validator() {
                  if (
                    form.getFieldValue('isUniversityStudent') === 'yes' ||
                    form.getFieldValue('wasJufoParticipant') === 'yes'
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'Du musst entweder an Jugend forscht teilgenommen haben oder noch offiziell als Student*in eingeschrieben sein!'
                  );
                },
              }),
            ]}
            initialValue={isUniversityStudent ? 'yes' : 'no'}
          >
            <Radio.Group
              onChange={(e) => {
                setIsUniversityStudent(e.target.value === 'yes');
              }}
            >
              <Radio.Button value="yes">Ja</Radio.Button>
              <Radio.Button value="no">Nein</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
        {isJufo && !isTutor && wasJufoParticipant && !isUniversityStudent && (
          <Form.Item
            className={classes.formItem}
            label="Hast du eine Urkunde oder einen ähnlichen Nachweis deiner Teilnahme an Jugend forscht und könntest uns diesen vorlegen?"
            name="hasJufoCertificate"
            rules={[
              {
                required: wasJufoParticipant && !isUniversityStudent,
                message: 'Bitte wähle eine Option aus.',
              },
            ]}
            initialValue={hasJufoCertificate ? 'yes' : 'no'}
          >
            <Radio.Group
              onChange={(e) => {
                setHasJufoCertificate(e.target.value === 'yes');
              }}
            >
              <Radio.Button value="yes">Ja</Radio.Button>
              <Radio.Button value="no">Nein</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
        {isJufo &&
          !isTutor &&
          wasJufoParticipant &&
          !isUniversityStudent &&
          !hasJufoCertificate && (
            <>
              <Form.Item
                className={classes.formItem}
                label="Was kannst du uns noch über deine damalige Teilnahme an Jugend forscht berichten?"
                name="jufoPastParticipationInfo"
                rules={[
                  {
                    required: wasJufoParticipant && !isUniversityStudent,
                    message:
                      'Bitte gib hier ein paar Infos an! Normalerweise reichen schon wenige Informationen aus.',
                  },
                ]}
                initialValue={formData.jufoPastParticipationInfo}
                extra={`Wir benötigen diese Informationen im Zusammenhang mit deinem Namen, um dich 
                eindeutig unter allen ehemaligen Jugend forscht Teilnehmer*innen identifizieren zu können. 
                So hilfst du uns, dich schneller verifizieren und freischalten zu können. 
                Beispiele wären: Jahr deiner Teilnahme oder das (ungefähre) Thema deines damaligen Projekts. 
                Aber auch dein Geburtsdatum oder das Bundesland, in dem du angetreten bist, helfen uns.`}
              >
                <Input.TextArea
                  autoSize={{ minRows: isGroups ? 6 : 4 }}
                  placeholder="Gib hier kurz und informal ein paar Infos an, die uns helfen können, deine frühere Teilnahme an Jugend forscht zu verifizieren."
                />
              </Form.Item>
            </>
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

        {(isUniversityStudent || !isJufo) && (
          <Form.Item
            className={classes.formItem}
            label="Universität/Hochschule"
            name="university"
            rules={[{ required: false }]}
            initialValue={formData.university}
          >
            <UniSelect />
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
            // eslint-disable-next-line no-nested-ternary
            isGroups
              ? 'Beschreibe die Inhalte deines Gruppenkurses bzw. deiner Gruppenkurse (3-5 Sätze)'
              : isJufo
              ? 'Stelle dich kurz vor.'
              : 'Nachricht hinzufügen'
          }
          name="msg"
        >
          <Input.TextArea
            autoSize={{ minRows: isGroups ? 6 : 4 }}
            placeholder={
              // eslint-disable-next-line no-nested-ternary
              isGroups
                ? 'Kursthema, Zielgruppe, Kursgröße, Interaktion'
                : isJufo
                ? 'Stelle dich kurz vor.'
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
        {formData.hasJufoCertificate === false && (
          <Form.Item
            className={classes.formItem}
            label="Datenübermittlung an Jugend forscht"
            name="jufoDataExchange"
            rules={[
              {
                required: formData.hasJufoCertificate === false,
                message: `Die Übermittlung der Daten ist für deine Teilnahme 
                zwingend notwendig. Alternativ kannst du uns auch bei deinem 
                Kennenlerngespräch mit uns einen anderen Nachweis vorlegen. 
                In diesem Fall gehe bitte noch einmal einen Schritt zurück.`,
              },
            ]}
          >
            <Checkbox.Group className={classes.checkboxGroup}>
              <Checkbox value="dataprotection">
                Ich bin damit einverstanden, dass meine Daten zum Zweck der
                Überprüfung meines Status als Alumna*Alumnus des Wettbewerbs
                Jugend forscht/Schüler experimentieren an die Stiftung Jugend
                forscht e. V., Baumwall 3, 20459 Hamburg übermittelt werden.
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>
        )}
        <Form.Item
          className={classes.formItem}
          label="Datenschutzrechtliche Einwilligung"
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
              Matchingpartner*innen übermittelt werden. Die Verarbeitung der
              personenbezogenen Daten erfolgt auf privaten IT-Geräten der
              Matchingpartner*innen. Es kann im Rahmen der Übermittlung dazu
              kommen, dass personenbezogene Daten an E-Mail Server (bspw.
              google-mail oder @me.com) außerhalb der Europäischen Union
              übermittelt werden. In Ländern außerhalb der Europäischen Union
              besteht ggf. kein adäquates Datenschutzniveau. Zudem kann die
              Durchsetzung von Rechten erschwert bzw. ausgeschlossen sein. Mir
              sind diese Risiken bewusst und bekannt.
              <br />
              Mir ist außerdem bekannt, dass meine Einwilligung freiwillig und
              jederzeit mit Wirkung für die Zukunft widerruflich ist. Ein
              Widerruf der Einwilligung kann formlos erfolgen (bspw. an{' '}
              <a href="mailto:datenschutz@corona-school.de">
                datenschutz@corona-school.de
              </a>
              ). Mir ist bewusst, dass der Widerruf nur für die Zukunft gilt und
              daher Datenverarbeitungen bis zum Widerruf, insbesondere die
              Weitergabe von meinen personenbezogenen Daten an geeignete
              Matchingpartner*innen bis zum Zeitpunkt des Widerrufs unberührt
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
                Für den Fall, dass die einwilligende Person das 18. Lebensjahr
                noch nicht vollendet hat, hat der Träger der elterlichen
                Verantwortung für die Person die Einwilligung zu erklären.
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
      isProjectCoach: data.isJufo,
      isUniversityStudent: data.isUniversityStudent === 'yes',
      wasJufoParticipant: data.wasJufoParticipant,
      projectFields: data.project,
      hasJufoCertificate: data.hasJufoCertificate,
      jufoPastParticipationInfo: data.jufoPastParticipationInfo,
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
        if (err?.response?.status === 401) {
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
          isJufo,
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
          project: formValues.project || [],
          wasJufoParticipant: formValues.wasJufoParticipant,
          isUniversityStudent: formValues.isUniversityStudent,
          hasJufoCertificate:
            formValues.wasJufoParticipant === 'yes' &&
            formValues.isUniversityStudent === 'no'
              ? formValues.hasJufoCertificate === 'yes'
              : undefined,
          jufoPastParticipationInfo: formValues.jufoPastParticipationInfo,
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
