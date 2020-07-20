import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useLocation, Link } from 'react-router-dom';
import classnames from 'classnames';
import { getUserId } from '../api/api';
import Context from '../context';
import storedCredentials from '../api/storedCredentials';
import Icons from '../assets/icons';
import Button from '../components/button';
import SignupContainer from '../components/container/SignupContainer';
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
    'idle' | 'loading' | 'error' | 'success' | 'rateLimit'
  >('idle');
  const [email, setEmail] = useState('');

  const query = useQuery();
  const token = query.get('token');

  const redirectPath = query.get('path');

  const authContext = useContext(Context.Auth);
  const apiContext = useContext(Context.Api);

  useEffect(() => {
    if (authContext.status === 'authorized') setState('success');
  }, [authContext.status]);

  useEffect(() => {
    if (token) {
      setState('pending');
      getUserId(token)
        .then((id) => {
          storedCredentials.write({ id, token });
          authContext.setCredentials({ id, token });
        })
        .catch(() => {
          setState('failed');
        });
    }
  }, []);

  const login = () => {
    setLoginState('loading');
    apiContext
      .requestNewToken(email, redirectPath)
      .then(() => {
        setLoginState('success');
      })
      .catch((error) => {
        if (error === 403) {
          setLoginState('rateLimit');
        }
        else {
          setLoginState('error');
        }
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
    if (redirectPath && redirectPath !== "") {
      return <Redirect to={redirectPath} />
    }
    return <Redirect to="/dashboard" />;
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
        {(loginState === 'error' || loginState === 'rateLimit') && (
          <Title className={classes.loginTitle} size="h4">
            Das hat leider nicht geklappt.
          </Title>
        )}
        {loginState === 'success' && (
          <div className={classes.successContainer}>
            <Title className={classes.loginTitle} size="h4">
              Wir haben dir eine E-Mail geschickt.
            </Title>
            <Text>
              In dieser E-Mail ist ein Zugangslink enthalten.<br/>
              Klicke einfach auf den Link in der E-Mail und du kommst direkt in deinen persönlichen User-Bereich!
            </Text>
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
        {loginState === 'rateLimit' && (
          <Text className={classes.textError}>
            Du hast in den letzten 24 Stunden bereits einen bisher ungenutzen Zugangslink angefordert. <br/>
            Bitte schaue dafür in dein E-Mail-Postfach nach einer E-Mail von uns. <br/>
            Wenn du auch nach ca. 10 Minuten noch keinen Zugangslink bekommen hast, wende dich bitte an <a href="mailto:support@corona-school.de">support@corona-school.de</a> oder warte bis zum nächsten Tag, um erneut einen Zugangslink anzufordern.
          </Text>
        )}
        {loginState !== 'success' && (
          <Button
            className={classes.signinButton}
            color="white"
            backgroundColor="#4E6AE6"
            onClick={login}
          >
            Anmelden
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
          <Link to={`/register?redirectTo=${redirectPath ?? ""}`}>
            <a>registrieren</a>
          </Link>
          .
        </Text>
      </div>
    </SignupContainer>
  );
};

export default Login;
