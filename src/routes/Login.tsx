import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom';
import { message } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { APIError, getUserId } from '../api/api';
import Context from '../context';
import storedCredentials from '../api/storedCredentials';
import SignupContainer from '../components/container/SignupContainer';
import classes from './Login.module.scss';
import PageLoading from '../components/PageLoading';
import {
  isProjectCoachButNotTutor,
  isProjectCoacheeButNotPupil,
} from '../utils/UserUtils';
import AccentColorButton from '../components/button/AccentColorButton';
import Textbox from '../components/misc/Textbox';
import styles from '../components/button/SaveEditButton.module.scss';
import RegisterTutee from './RegisterTutee';
import Register from './Register';
import { getDomainComponents } from '../utils/DomainUtils';
import RegisterTutor from './RegisterTutor';
import { ReactComponent as PaperPlane } from '../assets/icons/paper-plane-solid.svg';
import { NoRegistration } from '../components/NoService';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Login: React.FC<{
  mode: 'login' | 'register';
  isStudent?: boolean;
  isPupil?: boolean;
}> = ({ mode, isStudent, isPupil }) => {
  const [state, setState] = useState<
    'noToken' | 'pending' | 'failed' | 'success'
  >('noToken');
  const [loginState, setLoginState] = useState<
    'idle' | 'loading' | 'error' | 'success' | 'rateLimit'
  >('idle');
  const [email, setEmail] = useState('');
  const [errorHasOccurred, setErrorHasOccurred] = useState(false);
  const [pageIndex, setPageIndex] = useState(mode === 'login' ? 0 : 1);
  const query = useQuery();
  const token = query.get('token');
  const history = useHistory();
  // through URI encoding, the path can <also have query parameters inside
  const redirectPath = decodeURIComponent(query.get('path') ?? '');

  const authContext = useContext(Context.Auth);
  const userContext = useContext(Context.User);
  const apiContext = useContext(Context.Api);

  const [registerAsStudent, setRegisterAsStudent] = useState(false);
  const [registerAsPupil, setRegisterAsPupil] = useState(false);

  const domainComponents = getDomainComponents();
  const subdomain = domainComponents?.length > 0 && domainComponents[0];
  const isJufoSubdomain = subdomain === 'jufo';
  const isDrehtuerSubdomain = subdomain === 'drehtuer';
  const isCoDuSubdomain = subdomain === 'codu';

  // Forbid user to change to login mode if they use a subdomain
  const allowPickMode =
    !isCoDuSubdomain && !isJufoSubdomain && !isDrehtuerSubdomain;

  const Loader = () => {
    return (
      <div className={styles.LoaderWrapper}>
        <ClipLoader size={15} loading />
      </div>
    );
  };

  useEffect(() => {
    if (authContext.status === 'authorized') setState('success');
    if (authContext.status === 'invalid') setState('failed'); // if a stored token is invalid...
  }, [authContext.status]);

  useEffect(() => {
    if (isStudent) {
      setRegisterAsStudent(true);
      setRegisterAsPupil(false);
    } else if (isPupil) {
      setRegisterAsStudent(false);
      setRegisterAsPupil(true);
    }
  }, [isStudent, isPupil]);

  useEffect(() => {
    if (registerAsPupil) {
      history.push('/register/tutee');
    } else if (registerAsStudent) {
      history.push('/register/student');
    }
  }, [registerAsPupil, registerAsStudent]);

  useEffect(() => {
    if (state === 'failed') {
      message.error(
        'Du konntest nicht eingeloggt werden. Hast du bereits einen neueren Zugangslink bekommen?',
        9
      );
    }
  }, [state]);

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
  }, [token]);

  const login = () => {
    setLoginState('loading');
    apiContext
      .requestNewToken(email, redirectPath)
      .then(() => {
        setLoginState('success');
      })
      .catch((error: APIError) => {
        if (error.code === 403) {
          setLoginState('rateLimit');
          message.error(
            'Du hast zu oft versucht, dich anzumelden. Bitte versuche es später erneut.'
          );
          setErrorHasOccurred(true);
        } else if (error.code === 409) {
          setLoginState('error');
          message.error(
            'Du bist noch nicht verifiziert. Bitte checke deine E-Mails, wir haben dir soeben eine weitere Verifizierungsemail gesendet.'
          );
          setErrorHasOccurred(true);
        } else {
          setLoginState('error');
          message.error(
            'Das hat leider nicht geklappt. Bitte versuche es später erneut.'
          );
          setErrorHasOccurred(true);
        }
      });
  };

  useEffect(() => {
    if (!history.location.pathname.startsWith('/login') && pageIndex === 0) {
      history.push('/login');
    } else if (
      !history.location.pathname.startsWith('/register') &&
      pageIndex === 1
    ) {
      if (registerAsPupil) {
        history.push('/register/tutee');
      } else if (registerAsStudent) {
        history.push('/register/student');
      } else {
        history.push('/register');
      }
    }
  }, [pageIndex]);

  // show UI based on the state (not the loginState, which is used for the token requests)
  switch (state) {
    // successfully logged in
    case 'success':
      if (redirectPath && redirectPath !== '') {
        return <Redirect to={redirectPath} />;
      }

      if (
        isProjectCoachButNotTutor(userContext.user) ||
        isProjectCoacheeButNotPupil(userContext.user)
      ) {
        return <Redirect to="/project-coaching" />;
      }
      return <Redirect to="/dashboard" />;

    // have a token in the url and querying the api to verify the token and log in
    case 'pending':
      return <PageLoading />; // indicate page loading

    // have a token, but that one is invalid
    case 'failed':
      // render the normal page but show a error message
      // see useEffect above that shows the error message to prevent side effects
      break;

    // no token in the url (so waiting for the authContext status to be success, then log in)
    case 'noToken':
      if (authContext.status === 'pending') {
        // trying to log in with a stored token (at least checking if a token is stored)
        return <PageLoading text="Die Seite wird geladen... 🐌" />;
      }
      break; // otherwise render the normal SignUpContainer below
    default:
      break;
  }

  // no token in the url (at least not a valid one) / no token in localStorage (at least not a valid one)
  return (
    <SignupContainer shouldShowBackButton={false}>
      {loginState === 'success' && (
        <div className={classes.successContainer}>
          <h3 className={classes.loginTitle}>Checke deine E-Mails.</h3>
          <p>
            Wir haben dir eine E-Mail geschickt.
            <br />
            Logge dich ein, indem du auf den Link in der E-Mail klickst!
          </p>
          <div>
            <PaperPlane className={classes.paperPlane} />
          </div>
        </div>
      )}
      {loginState !== 'success' && (
        <div className={classes.signinContainer}>
          {allowPickMode && (
            <div className={classes.formHeader}>
              <button
                className={`${classes.formHeaderButton} ${
                  pageIndex === 0 ? classes.activePage : ''
                }`}
                onClick={() => setPageIndex(0)}
              >
                <p>Anmelden</p>
              </button>
              <button
                className={`${classes.formHeaderButton} ${
                  pageIndex === 1 ? classes.activePage : ''
                }`}
                onClick={() => {
                  setRegisterAsPupil(false); // Reset student/pupil choice upon button click
                  setRegisterAsStudent(false);
                  setPageIndex(1);
                }}
              >
                <p>Registrieren</p>
              </button>
            </div>
          )}
          {pageIndex === 0 ? (
            <div className={classes.form}>
              {errorHasOccurred && (
                <div className={classes.tuteeNote}>
                  Du kannst dich bei Problemen gerne an{' '}
                  <a href="mailto:support@lern-fair.de">support@lern-fair.de</a>{' '}
                  wenden.
                </div>
              )}
              <Textbox
                label="Deine Email-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className={classes.buttonBox}>
                <AccentColorButton
                  accentColor="#0366e0"
                  label="Anmelden"
                  onClick={login}
                  className={classes.submitButton}
                  Icon={loginState === 'loading' ? Loader : null}
                  disabled={loginState === 'loading'}
                />
              </div>
            </div>
          ) : (
            <div className={classes.form}>
              {/* Retro-fitting old registration form into new login/signup form until a new registration form has been made */}
              <Route path="/register/tutee">
                <RegisterTutee
                  isJufoSubdomain={isJufoSubdomain}
                  isDrehtuerSubdomain={isDrehtuerSubdomain}
                  isCoDuSubdomain={isCoDuSubdomain}
                />
              </Route>
              <Route path="/register/internship">
                <NoRegistration />
              </Route>
              <Route path="/register/club">
                <RegisterTutor isClub isJufoSubdomain={isJufoSubdomain} />
              </Route>
              <Route path="/register/student">
                <RegisterTutor isStudent isJufoSubdomain={isJufoSubdomain} />
              </Route>
              <Route path="/register/tutor">
                <RegisterTutor
                  isJufoSubdomain={isJufoSubdomain}
                  isDrehtuerSubdomain={isDrehtuerSubdomain}
                />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
            </div>
          )}
        </div>
      )}
    </SignupContainer>
  );
};

export default Login;
