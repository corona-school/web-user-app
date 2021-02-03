import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import ClipLoader from 'react-spinners/ClipLoader';

import Context from '../context';
import classes from './GuestJoinCourseMeeting.module.scss';

moment.locale('de');

const GuestJoinCourseMeeting = () => {
  // URL PARAMS
  const { token } = useParams<{ token: string }>();

  // CONTEXT
  const apiContext = useContext(Context.Api);

  // STATE
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [bbbURL, setBBBURL] = useState<string>(null);

  // API-REQUEST
  useEffect(() => {
    apiContext
      .guestJoinBBBmeeting(token)
      .then(({ url }) => {
        setBBBURL(url);
        setIsLoading(false);
        setLoadingError(null);
      })
      .catch((e) => {
        setIsLoading(false);
        setBBBURL(null);
        setLoadingError(e.request?.status);
      });
  }, [token, apiContext]);

  const renderLoadingIndicator = () => {
    return (
      <div>
        <ClipLoader size={100} color="#123abc" loading />
      </div>
    );
  };

  const renderContent = () => {
    // LOADING INDICATOR
    if (isLoading) {
      return renderLoadingIndicator();
    }

    // ERROR MESSAGE
    let errorEmoji = '❌';
    let errorMessage: string = null;
    if (loadingError) {
      switch (loadingError) {
        case 428: // indicate meeting not yet started
          errorMessage =
            'Der Kurs hat noch nicht begonnen... Bitte versuche es später erneut!';
          errorEmoji = '⏳';
          break;
        case 400: // indicate invalid token
          errorMessage = 'Dieser Link ist nicht (mehr) gültig...';
          errorEmoji = '😕';
          break;
        default:
          errorMessage = 'Es ist ein unbekannter Fehler aufgetreten!';
          break;
      }
    } else if (!bbbURL) {
      // general error message if no bbb url is given
      errorMessage =
        'Ein Fehler ist aufgetreten. Probiere es gleich noch einmal!';
    }

    if (errorMessage) {
      // todo: put this into a component
      return (
        <div className={classes.errorContainer}>
          <span className={classes.errorEmoji}>{errorEmoji}</span>
          <span className={classes.mainMessage}>{errorMessage}</span>
        </div>
      );
    }

    // SUCCESS -> REDIRECT
    window.location.href = bbbURL;
    return renderLoadingIndicator();
  };

  return <div className={classes.main}>{renderContent()}</div>;
};

export default GuestJoinCourseMeeting;
