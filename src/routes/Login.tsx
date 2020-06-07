import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useLocation, Link } from 'react-router-dom';
import classnames from 'classnames';
import { getUserId } from '../api/api';
import Context from '../context';
import storedCredentials from '../api/storedCredentials';
import Icons from '../assets/icons';
import Button from '../components/button';
import SignupContainer from '../components/signup/SignupContainer';
import { Title, Text } from '../components/Typography';
import { Input } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';

import classes from './Login.module.scss';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Login: React.FC = () => {
  const [state, setState] = useState<
    'noToken' | 'pending' | 'failed' | 'success'
  >('noToken');
  const [loginState, setLoginState] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle');
  const [email, setEmail] = useState('');

  const query = useQuery();
  const token = query.get('token');

  const authContext = useContext(Context.Auth);
  const apiContext = useContext(Context.Api);

  useEffect(() => {
    if (!token && authContext.status === 'authorized') setState('success');
  }, [authContext.status]);

  useEffect(() => {
    if (token) {
      setState('pending');
      getUserId(token)
        .then((id) => {
          storedCredentials.write({ id, token });
          authContext.setCredentials({ id, token });
          setState('success');
        })
        .catch(() => {
          setState('failed');
        });
    }
  }, []);

  const login = () => {
    setLoginState('loading');
    apiContext
      .requestNewToken(email)
      .then(() => {
        setLoginState('success');
      })
      .catch(() => {
        setLoginState('error');
      });
  };

  const renderLoginExplanation = () => {
    return (
      <>
        <div className={classes.step}>
          <Icons.SignupNumber1 />
          <Text large className={classes.stepText}>
            Trage deine E-Mail-Adresse ein und fordere einen Zugang an.
          </Text>
        </div>
        <div className={classes.step}>
          <Icons.SignupNumber2 />
          <Text large className={classes.stepText}>
            Wir senden dir eine E-Mail mit einem personalisierten Link.
          </Text>
        </div>
        <div className={classes.step}>
          <Icons.SignupNumber3 />
          <Text large className={classes.stepText}>
            Öffne die E-Mail und klicke den Link, um zu deinem User-Bereich zu
            gelangen.
          </Text>
        </div>
      </>
    );
  };

  if (state === 'success') {
    return <Redirect to="/settings" />;
  }

  return (
    <SignupContainer>
      <div className={classes.signinContainer}>
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
        <Title>Dein persönlicher User-Bereich</Title>

        {loginState === 'idle' && renderLoginExplanation()}
        {loginState === 'loading' && (
          <div>
            <ClipLoader size={100} color={'#123abc'} loading={true} />
          </div>
        )}
        {loginState === 'error' && (
          <Title className={classes.loginTitle} size="h4">
            Das hat leider nicht geklappt.
          </Title>
        )}
        {loginState === 'success' && (
          <div className={classes.successContainer}>
            <Title className={classes.loginTitle} size="h4">
              Wir haben dir eine E-Mail geschickt.
            </Title>
            <Icons.SignupEmailSent />
          </div>
        )}

        {loginState !== 'success' && (
          <div className={classes.inputContainer}>
            <Text className={classes.description}>E-Mail</Text>
            <Input
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  login();
                }
              }}
              className={classnames(classes.inputField, {
                [classes.errorInput]: loginState === 'error',
              })}
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        {loginState === 'error' && (
          <Text className={classes.textError}>
            Wir konnten deine E-Mail-Adresse leider nicht in unserem System
            finden.
          </Text>
        )}
        {loginState !== 'success' ? (
          <Button
            className={classes.signinButton}
            color="white"
            backgroundColor="#4E6AE6"
            onClick={login}
          >
            Anmelden
          </Button>
        ) : (
          <Button
            className={classes.successButton}
            color="#2B2C3B"
            backgroundColor="white"
            onClick={login}
          >
            E-Mail erneut versenden
          </Button>
        )}
        {loginState !== 'idle' && (
          <Text className={classes.helpText}>
            Bei technischen Schwierigkeiten kannst du dich jederzeit an{` `}
            <a href="mailto:support@corona-school.de">
              support@corona-school.de
            </a>{' '}
            wenden.
          </Text>
        )}
        <Text className={classes.description}>
          Du hast noch kein Account? Hier{' '}
          <Link to="/register">
            <a>registrieren</a>
          </Link>
        </Text>
      </div>
    </SignupContainer>
  );
};

export default Login;
