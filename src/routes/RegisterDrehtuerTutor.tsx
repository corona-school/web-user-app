import { Form, message } from 'antd';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Icons from '../assets/icons';
import Button from '../components/button';
import SignupContainer from '../components/container/SignupContainer';
import {
  DataProtectionField,
  EmailField,
  MessageField,
  NameField,
  StateField,
  UniversityField,
} from '../components/forms/registration';
import { Title, Text } from '../components/Typography';
import { ApiContext } from '../context/ApiContext';
import { Tutor } from '../types/Registration';
import classes from './RegisterDrehtuerTutor.module.scss';

export const RegisterDrehtuerTutor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<'start' | 'done'>('start');

  const [form] = Form.useForm();
  const apiContext = useContext(ApiContext);

  const renderFormItems = () => {
    return (
      <>
        <NameField className={classes.formItem} />
        <EmailField className={classes.formItem} />
        <StateField className={classes.formItem} />
        <UniversityField className={classes.formItem} />
        <MessageField className={classes.formItem} isGroups />
        <DataProtectionField className={classes.formItem} />
      </>
    );
  };

  const registerTutor = async () => {
    try {
      const formValues = await form.validateFields();

      const data: Tutor = {
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        email: formValues.email,
        state: formValues.state,
        university: formValues.university,
        msg: formValues.msg,
        // empty
        isTutor: false,
        isOfficial: false,
        isInstructor: true,
        isProjectCoach: false,
        newsletter: false,
      };

      setLoading(true);

      apiContext
        .registerTutor(data)
        .then(() => {
          setFormState('done');
        })
        .catch((err) => {
          message.error('Fehler');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <SignupContainer shouldShowBackButton>
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
        <Title className={classes.tuteeTitle}>
          {formState === 'done' ? (
            <span>Du wurdest erfolgreich als Leiter*in registriert</span>
          ) : (
            <span>
              Ich möchte mich registrieren als <b>Leiter*in</b>
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
          <Button
            onClick={registerTutor}
            className={classes.signupButton}
            color="white"
            backgroundColor="#4E6AE6"
          >
            Registrieren
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
