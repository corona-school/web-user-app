import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import StyledReactModal from 'styled-react-modal';
import PageComponent from '../components/PageComponent';
import { getUserId } from '../api/api';
import Context from '../context';
import storedCredentials from '../api/storedCredentials';
import Icons from '../assets/icons';
import loginGraphic1 from '../assets/images/loginGraphic1.svg';
import messageSent1 from '../assets/images/messageSent1.svg';
import notFound1 from '../assets/images/notFound1.svg';
import Button from '../components/Button';

const SpacerDiv = styled.div<{ flexGrow: string }>`
  flex-grow: ${(props) => props.flexGrow};
`;

const Header = styled.div`
  height: 73px;

  align-items: center;
  display: flex;

  width: 100%;

  background: #e9bc34;

  font-size: 36px;
  line-height: 54px;

  color: #ffffff;

  svg {
    margin-left: 25px;
    margin-right: 10px;

    path {
      fill: #ffffff;
    }
  }
`;

const LoginPage = styled.div`
  width: 100vw;
  height: 100vh;

  background: #f2c94c;

  align-items: center;
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
  }
`;

const StyledLoginCard = styled.div`
  width: 1020px;
  height: 468px;

  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;

  padding: 12px 30px;

  position: relative;

  display: flex;

  img {
    margin: 30px;
    justify-self: flex-end;
    flex-grow: 1;
  }

  input {
    /* Frame 132 */

    width: 378px;
    height: 36px;

    background: #ffffff;

    /* Gray 1 */
    border: 1px solid #333333;
    box-sizing: border-box;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);

    font-style: italic;
    font-size: 18px;
    line-height: 27px;

    padding: 0.5em;
    margin: 0.5em;

    ::placeholder {
      color: #bdbdbd;
    }
  }
`;

const TextBox = styled.div`
  width: 50%;
`;

const Title = styled.p`
  font-size: 36px;
  line-height: 54px;
  color: #000000;
`;

const Text = styled.p`
  font-size: 18px;
  line-height: 27px;
  color: #333333;
  margin: 12px 0;
`;

const Small = styled.p``;

const Step = styled.div`
  font-size: 18px;
  line-height: 27px;
  color: #333333;
  margin: 10px 0;

  strong {
    font-weight: bold;
  }

  > svg {
    width: 1em;
    height: 1em;
    margin: -2px 10px;
  }
`;

const BackLink = styled.a`
  /* Frame 134 */

  display: flex;
  align-items: center;

  width: 199px;
  height: 49px;

  position: absolute;
  right: 0;
  bottom: 0;

  font-size: 18px;
  line-height: 27px;

  color: #828282;
`;

const FormWrapper = styled.div`
  align-items: center;
  display: flex;
  width: 613px;
  position: absolute;
  width: 613px;
  /* height: 259px; */
  left: 37px;
  top: 400px;

  input {
    /* Frame 132 */

    width: 378px;
    height: 36px;

    background: #ffffff;

    /* Gray 1 */
    border: 1px solid #333333;
    box-sizing: border-box;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);

    font-style: italic;
    font-size: 18px;
    line-height: 27px;

    padding: 0.5em;
    margin: 0.5em;

    ::placeholder {
      color: #bdbdbd;
    }
  }
`;

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

    font-family: Poppins;
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

    font-family: Poppins;
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

    font-family: Poppins;
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

    font-family: Poppins;
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

    font-family: Poppins;
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
    <LoginPage>
      <Header>
        <Icons.Logo />
        Corona School
      </Header>
      <SpacerDiv flexGrow="2" />
      <StyledLoginCard>
        <TextBox>
          <Title>Dein persönlicher User-Bereich</Title>
          <Text>
            So erhältst du Zugang zu deinem persönlichen User-Bereich:
          </Text>
          <Step>
            <Icons.Info />
            <strong>Schritt 1: </strong>
            Trage deine E-Mail-Adresse ein und fordere einen Zugang an.
          </Step>
          <Step>
            <Icons.Contact />
            <strong>Schritt 2: </strong>
            Wir senden dir eine E-Mail mit einem personalisierten Link.
          </Step>
          <Step>
            <Icons.Mouse />
            <strong>Schritt 3: </strong>
            Öffne die E-Mail und klicke den Link, um zu deinem User-Bereich zu
            gelangen.
          </Step>
          <div style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
            <input
              placeholder="E-Mail"
              value={email}
              autoComplete="on"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              text="Zugang anfordern"
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
          </div>
        </TextBox>
        <img src={loginGraphic1} />
        <BackLink href="https://www.corona-school.de/">
          Zurück zur Startseite
        </BackLink>
      </StyledLoginCard>
      <SpacerDiv flexGrow="5" />

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
          <FormWrapper>
            <input
              placeholder="E-Mail"
              value={email}
              autoComplete="on"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
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
          </FormWrapper>
          <span className="hint">
            Tipp: Versuche es mit der E-Mail-Adresse, die du für die
            Registrierung verwendet hast.
          </span>
          <img src={notFound1}></img>
        </ModalFailWrapper>
      </StyledReactModal>
      {state === 'success' && <Redirect to="/settings" />}
    </LoginPage>
  );
};

export default Login;
