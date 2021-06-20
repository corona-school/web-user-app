import { Result } from 'antd';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import Images from '../assets/images';
import { LinkButton } from '../components/button';
import { ApiContext } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext';
import classes from './InterestConfirmation.module.scss';
import { OnCoronaSchoolDomain } from '../utils/LernFairRedirection';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
const InterestConfirmation: React.FC = () => {
  const apiContext = useContext(ApiContext);
  const authContext = useContext(AuthContext);

  const [state, setState] = useState<'loading' | 'failed' | 'success'>(
    'loading'
  );

  const query = useQuery();

  const token = query.get('token');
  const confirmed = query.get('confirmed')?.toLowerCase();

  let confirmationStatus: 'confirmed' | 'refused' | null = null;
  if (['true', 'false'].includes(confirmed)) {
    confirmationStatus = confirmed === 'true' ? 'confirmed' : 'refused';
  }

  const editInterestConfirmationStatus = useRef(
    apiContext.editInterestConfirmationStatus
  ); // use ref to have not trigger rerender if apiContext changes, since this method is _currently_ of more static nature.
  useEffect(() => {
    if (OnCoronaSchoolDomain()) return; // do not confirm on corona-school.de
    if (!confirmationStatus) {
      // ungültige Anfrage
      setState('failed');
      return;
    }
    setState('loading');
    editInterestConfirmationStatus
      .current(token, confirmationStatus)
      .then(() => setState('success'))
      .catch((err) => {
        console.warn(
          `Error when trying to change interest confirmation status: ${err}`
        );
        setState('failed');
      });
  }, [confirmationStatus, token]);

  const getInfoForStatus = (cs: typeof confirmationStatus) => {
    switch (cs) {
      case 'refused':
        return {
          image: Images.Cancel,
          title: 'Danke, dass du anderen Schüler*innen den Vortritt lässt!',
          text: (
            <>
              Wir werden nicht mehr nach einem/einer Lernpartner*in für dich
              suchen. <br />
              Dein Account bleibt aber aktiv und du kannst weiterhin unsere
              anderen <br />
              Angebote (1:1-Projektcoaching und Gruppenkurse) in Anspruch
              nehmen.
            </>
          ),
        };
      case 'confirmed':
        return {
          image: Images.Completed,
          title: 'Vielen Dank für deine Bestätigung!',
          text: (
            <>
              Sobald wir eine*n Student*in gefunden haben, werden wir dich
              schnellstmöglich per E-Mail informieren.
              <br />
              Bitte überprüfe dazu regelmäßig dein E-Mail-Postfach.
            </>
          ),
        };
      default:
        return null;
    }
  };

  const renderStatusIndication = () => {
    switch (state) {
      case 'loading':
        return (
          <div className={classes.LoaderWrapper}>
            <ClipLoader size={100} color="#123abc" loading />
            Einen Moment...
          </div>
        );
      case 'success': {
        const info = getInfoForStatus(confirmationStatus);
        return (
          <Result
            icon={<info.image className={classes.RequestSuccessImage} />}
            status="success"
            title={info.title}
            subTitle={info.text}
          />
        );
      }
      case 'failed':
      default:
        return (
          <Result
            status="500"
            title="Ungültige Anfrage"
            subTitle="Es ist ein Fehler aufgetreten. Ist dieser Link korrekt? Versuche eventuell, den Link aus der E-Mail zu kopieren."
          />
        );
    }
  };
  const renderHomeButton = () => {
    if (authContext.status !== 'authorized') {
      return null; // nothing
    }
    return (
      <div>
        <LinkButton href="/dashboard">Zum User-Bereich</LinkButton>
      </div>
    );
  };

  return (
    <div className={classes.Main}>
      <div className={classes.Container}>
        {renderStatusIndication()}
        {renderHomeButton()}
      </div>
      {state === 'success' && (
        <div className={classes.Footer}>
          Du kannst diese Seite nun schließen.
        </div>
      )}
    </div>
  );
};

export default InterestConfirmation;
