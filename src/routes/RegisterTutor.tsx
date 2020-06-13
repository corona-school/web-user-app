import React, { useState, useContext } from 'react';
import Icons from '../assets/icons';
import SignupContainer from '../components/signup/SignupContainer';
import { Title, Text } from '../components/Typography';
import {
  Form,
  Input,
  Checkbox,
  Radio,
  InputNumber,
  Select,
  message,
} from 'antd';
import Button from '../components/button';
import ClipLoader from 'react-spinners/ClipLoader';

import classes from './RegisterTutor.module.scss';
import { Subject } from '../types';
import { useHistory, Link } from 'react-router-dom';
import Context from '../context';
import { Tutor } from '../types/Registration';

const { Option } = Select;

interface FormData {
  // start
  firstname?: string;
  lastname?: string;
  email?: string;
  isOfficial?: boolean;
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

const RegisterTutor = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [isOfficial, setOfficial] = useState(false);
  const [isTutor, setTutor] = useState(false);
  const [formState, setFormState] = useState<
    'start' | 'detail' | 'finnish' | 'done'
  >('start');
  const [formData, setFormData] = useState<FormData>({});
  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

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
          label="E-Mail"
          name="email"
          rules={[{ required: true, message: 'Bitte trage deine E-Mail ein!' }]}
        >
          <Input
            placeholder="max.musterman@email.com"
            defaultValue={formData.email}
          />
        </Form.Item>

        <Form.Item
          className={classes.formItem}
          name="additional"
          label="Weitere Angaben"
          rules={[{ required: true, message: 'Bitte wähle eine Option aus' }]}
        >
          <Checkbox.Group className={classes.checkboxGroup}>
            <Checkbox
              onChange={(e) => {
                setTutor(!isTutor);
              }}
              value="isTutor"
              style={{ lineHeight: '32px', marginLeft: '8px' }}
              defaultChecked={formData.isTutor}
            >
              Ich möchte eine*n Schüler*in im 1-zu-1-Format unterstützen
            </Checkbox>
            <Checkbox value="isGroups" style={{ lineHeight: '32px' }}>
              Ich möchte meine Hilfe im Rahmen eines Kurses anbieten
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          className={classes.formItem}
          name="official"
          label="Hilfst du im Rahmen einer Universitätsveranstaltung? (z.B. Seminar oder Praktikum) "
        >
          <Checkbox.Group className={classes.checkboxGroup}>
            <Checkbox
              onChange={(e) => {
                setOfficial(!isOfficial);
              }}
              value="isOfficial"
              style={{ lineHeight: '32px', marginLeft: '8px' }}
              defaultChecked={formData.isOfficial}
            >
              Ja
            </Checkbox>
          </Checkbox.Group>
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
              placeholder="Baden-Württemberg"
              defaultValue={formData.state}
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
        )}
        {isTutor && (
          <Form.Item
            className={classes.formItem}
            label="Fächer"
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
        <Form.Item className={classes.formItem} label="Nachricht" name="msg">
          <Input.TextArea
            placeholder="Hier deine Nachricht"
            defaultValue={formData.msg}
          />
        </Form.Item>
        {isOfficial && (
          <Form.Item
            className={classes.formItem}
            label="Universität"
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
            label="Modul"
            name="module"
            rules={[{ required: true, message: 'Bitte trage dein Modul ein' }]}
          >
            <Radio.Group>
              <Radio.Button
                defaultChecked={formData.module === 'internship'}
                value="internship"
              >
                Praktikum
              </Radio.Button>
              <Radio.Button
                defaultChecked={formData.module === 'seminar'}
                value="seminar"
              >
                Seminar
              </Radio.Button>
              <Radio.Button
                defaultChecked={formData.module === 'other'}
                value="other"
              >
                Sonstiges
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
        {isOfficial && (
          <Form.Item
            className={classes.formItem}
            label="Aufwand (in Stunden)"
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
            <Checkbox value={'newsletter'} defaultChecked={formData.newsletter}>
              Ich möchte den Newsletter der Corona School erhalten und über
              Angebote, Aktionen und weitere Unterstützungsmöglichkeiten per
              E-Mail informiert werden.
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          className={classes.formItem}
          label="AGBs"
          name="dataprotection"
          rules={[
            {
              required: true,
              message: 'Bitte akzeptiere die AGBs',
            },
          ]}
        >
          <Checkbox.Group className={classes.checkboxGroup}>
            <Checkbox value="dataprotection">
              Durch die Registrierung stimmst du unseren Allgemeinen
              Geschäftsbedingungen zu. In unserer Datenschutzerklärung erfährst
              du, wir deine Daten erfassen, verwenden und teilen. Unsere
              Cookie-Richtlinie erklärt, wie wir Cookies verwenden.
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
          isOfficial: isOfficial,
          isTutor: formValues.additional.includes('isTutor'),
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
          module: formValues.module,
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
      university: data.university,
      module: data.module,
      hours: data.hours,
      newsletter: !!data.newsletter,
      msg: data.msg || '',
    };
  };

  const register = (data: FormData) => {
    const tutor = mapFormDataToTutor(data);
    if (!tutor) {
      message.error('Es ein Fehler aufgetreten.');
      return;
    }
    console.log(tutor);

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
        message.error('Es ein Fehler aufgetreten.');
      });
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
        <Title>
          {formState === 'done' ? (
            <span>Du wurdest erfolgreich als Tutor*in registriert</span>
          ) : (
            <span>
              Ich möchte mich registrieren als <b>Tutor*in</b>
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
            <ClipLoader size={100} color={'#123abc'} loading={true} />
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
      </Text>
    </SignupContainer>
  );
};

export default RegisterTutor;
