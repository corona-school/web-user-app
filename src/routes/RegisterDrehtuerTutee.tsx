import { Form, message } from 'antd';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Icons from '../assets/icons';
import Button, { LinkButton } from '../components/button';
import SignupContainer from '../components/container/SignupContainer';
import {
  DataProtectionField,
  EmailField,
  GradeField,
  NameField,
  SchoolKindField,
  StateField,
} from '../components/forms/registration';
import { Title, Text } from '../components/Typography';
import { ApiContext } from '../context/ApiContext';
import { Tutee } from '../types/Registration';
import classes from './RegisterDrehtuerTutee.module.scss';
import { env } from '../api/config';
import { NoRegistration } from '../components/NoService';

export const RegisterDrehtuerTutee: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<'start' | 'done'>('start');

  const [form] = Form.useForm();
  const apiContext = useContext(ApiContext);

  if (env.REACT_APP_DREHTUER === 'disabled') {
    return <NoRegistration />;
  }

  const registerTutee = async () => {
    try {
      const formValues = await form.validateFields();

      const data: Tutee = {
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        email: formValues.email,
        state: formValues.state?.toLowerCase(),
        school: formValues.school?.toLowerCase(),
        grade: parseInt(formValues.grade),
        // empty
        msg: '',
        isProjectCoachee: false,
        isTutee: false,
        languages: [],
        newsletter: false,
        registrationSource: 'DREHTUER',
      };

      setLoading(true);

      apiContext
        .registerTutee(data)
        .then(() => {
          setFormState('done');
        })
        .catch((err) => {
          message.error(
            'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
          );
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

  const renderForm = () => {
    if (formState === 'done') {
      return (
        <div className={classes.successContainer}>
          <Title className={classes.loginTitle} size="h4">
            Wir haben dir eine E-Mail geschickt.
          </Title>
          <Icons.SignupEmailSent />
        </div>
      );
    }

    return (
      <>
        <NameField className={classes.formItem} />
        <EmailField className={classes.formItem} />
        <SchoolKindField className={classes.formItem} />
        <StateField className={classes.formItem} />
        <GradeField className={classes.formItem} />
        <DataProtectionField className={classes.formItem} isDrehtuer />
      </>
    );
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
          renderForm()
        ) : (
          <div className={classes.loadingContainer}>
            <ClipLoader size={100} color="#123abc" loading />
          </div>
        )}

        <div className={classes.buttonContainer}>
          {formState === 'start' && (
            <Button
              onClick={registerTutee}
              className={classes.signupButton}
              color="white"
              backgroundColor="#4E6AE6"
            >
              Registrieren
            </Button>
          )}
          {formState === 'done' && (
            <LinkButton
              href="/login"
              local
              className={classes.signupButton}
              color="white"
              backgroundColor="#4E6AE6"
            >
              Anmelden
            </LinkButton>
          )}
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
