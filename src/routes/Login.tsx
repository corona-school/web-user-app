import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import StyledReactModal from 'styled-react-modal';

import { getUserId } from '../api/api';
import Context from '../context';
import storedCredentials from '../api/storedCredentials';
import Icons from '../assets/icons';
import messageSent1 from '../assets/images/messageSent1.svg';
import notFound1 from '../assets/images/notFound1.svg';
import Button, { OldButton } from '../components/button';
import SignupContainer from '../components/signup/SignupContainer';
import { Title, Text } from '../components/Typography';

import classes from './Login.module.scss';
import { Input } from 'antd';

const ModalSuccessWrapper = styled.div`
  /* loginPage-overlay-success */

  position: relative;
  width: 1020px;
  height: 479px;

  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;

  .title {
    position: absolute;
    width: 614px;
    height: 54px;
    left: 37px;
    top: 44px;

    font-style: normal;
    font-weight: normal;
    font-size: 36px;
    line-height: 54px;

    /* identical to box height */
    letter-spacing: -0.333333px;

    /* Gray 1 */
    color: #333333;
  }

  .text {
    position: absolute;
    width: 429px;
    height: 304px;
    left: 37px;
    top: 118px;

    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: -0.333333px;

    /* Gray 1 */
    color: #333333;

    small {
      font-size: 20px;
      line-height: 24px;
    }

    a {
      color: unset;
      text-decoration: none;
    }
  }

  img {
    /* undraw_message_sent_1030 (1) 1 */

    position: absolute;
    width: 498.19px;
    height: 300px;
    left: 510px;
    top: 122px;
  }
`;

const ModalFailWrapper = styled.div`
  /* loginPage-overlay-fail */

  position: relative;
  width: 1020px;
  height: 558px;

  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;

  .title {
    position: absolute;
    width: 516px;
    height: 54px;
    left: 37px;
    top: 39px;

    font-style: normal;
    font-weight: normal;
    font-size: 36px;
    line-height: 54px;

    /* identical to box height */
    letter-spacing: -0.333333px;

    /* Gray 1 */
    color: #333333;
  }

  .text {
    position: absolute;
    width: 414px;
    height: 259px;
    left: 37px;
    top: 118px;

    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: -0.333333px;

    /* Gray 1 */
    color: #333333;

    small {
      font-size: 20px;
      line-height: 24px;
    }

    a {
      color: unset;
      text-decoration: none;
    }
  }

  .hint {
    /*  */

    position: absolute;
    width: 440px;
    height: 27px;
    left: 37px;
    top: 505px;

    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 27px;

    /* identical to box height */
    letter-spacing: -0.333333px;

    /* Gray 3 */
    color: #828282;
  }

  img {
    /* undraw_not_found_60pq 1 */

    position: absolute;
    width: 314px;
    height: 226px;
    left: 651px;
    top: 151px;
  }
`;

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Login: React.FC = () => {
  const [state, setState] = useState<
    'noToken' | 'pending' | 'failed' | 'success'
  >('noToken');
  const [email, setEmail] = useState('');

  const query = useQuery();
  const token = query.get('token');

  const authContext = useContext(Context.Auth);
  const apiContext = useContext(Context.Api);
  const modalContext = useContext(Context.Modal);

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

  return (
    <SignupContainer>
      <div className={classes.signinContainer}>
        <Icons.Logo className={classes.logo} />
        <Title size="h2" bold>
          Corona School
        </Title>
        <Title>Dein persönlicher User-Bereich</Title>

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
        <div className={classes.inputContainer}>
          <Text className={classes.description}>E-Mail</Text>
          <Input
            className={classes.inputField}
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button
          className={classes.signinButton}
          color="white"
          backgroundColor="#4E6AE6"
          onClick={() =>
            apiContext
              .requestNewToken(email)
              .then(() =>
                modalContext.setOpenedModal('requestLoginToken--success')
              )
              .catch(() =>
                modalContext.setOpenedModal('requestLoginToken--failed')
              )
          }
        >
          Anmelden
        </Button>
        <Text className={classes.description}>
          Du hast noch kein Account? Hier{' '}
          <Link to="/register">
            <a>registrieren</a>
          </Link>
        </Text>
      </div>

      <StyledReactModal
        isOpen={modalContext.openedModal === 'requestLoginToken--success'}
      >
        <ModalSuccessWrapper>
          <span className="title">E-Mail wurde erfolgreich gesendet.</span>
          <span className="text">
            Wir haben dir eine E-Mail gesendet, in welcher sich ein Link zu
            deinem persönlichen User-Bereich befindet. Falls du keine E-Mail von
            uns erhalten hast, überprüfe bitte auch deinen Spam-Ordner.
            <br />
            <small>
              Bei technischen Schwierigkeiten kannst du dich jederzeit an{' '}
              <a href="mailto:support@corona-school.de">
                support@corona-school.de
              </a>{' '}
              wenden.
            </small>
          </span>
          <img src={messageSent1}></img>
        </ModalSuccessWrapper>
      </StyledReactModal>
      <StyledReactModal
        isOpen={modalContext.openedModal === 'requestLoginToken--failed'}
      >
        <ModalFailWrapper>
          <span className="title">Das hat leider nicht geklappt.</span>
          <span className="text">
            Wir konnten deine E-Mail-Adresse leider nicht in unserem System
            finden. Bitte überprüfe deine Eingabe und versuche es erneut.
            <br />
            <br />
            <small>
              Bei technischen Schwierigkeiten kannst du dich jederzeit an{' '}
              <a href="mailto:support@corona-school.de">
                support@corona-school.de
              </a>{' '}
              wenden.
            </small>
          </span>

          <input
            placeholder="E-Mail"
            value={email}
            autoComplete="on"
            onChange={(e) => setEmail(e.target.value)}
          />
          <OldButton
            text="Erneut versuchen"
            onClick={() =>
              apiContext
                .requestNewToken(email)
                .then(() =>
                  modalContext.setOpenedModal('requestLoginToken--success')
                )
                .catch(() =>
                  modalContext.setOpenedModal('requestLoginToken--failed')
                )
            }
          />

          <span className="hint">
            Tipp: Versuche es mit der E-Mail-Adresse, die du für die
            Registrierung verwendet hast.
          </span>
          <img src={notFound1}></img>
        </ModalFailWrapper>
      </StyledReactModal>
      {state === 'success' && <Redirect to="/settings" />}
    </SignupContainer>
  );
};

export default Login;
