/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import classes from './SignupContainer.module.scss';
import Images from '../../assets/images';
import { useHistory } from 'react-router-dom';

const SignupContainer: React.FC = (props) => {
  const history = useHistory();

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        {history.location.pathname !== '/login' && (
          <a
            className={classes.backButton}
            onClick={(e) => {
              e.preventDefault();
              if (/\/register\/[a-zA-Z]+/.test(history.location.pathname)) {
                history.push('/register');
                return;
              }
              if (/\/register$/.test(history.location.pathname)) {
                history.push('/login');
                return;
              }
            }}
          >
            Zurück
          </a>
        )}

        {props.children}
      </div>
      <div className={classes.background1}>
        <Images.SignupBackground1 />
      </div>

      <div className={classes.background2}>
        <Images.SignupBackground2 />
      </div>
      <div className={classes.background3}>
        <Images.SignupBackgroundCircle1 />
      </div>
      <div className={classes.background4}>
        <Images.SignupBackgroundCircle2 />
      </div>
      <div className={classes.background5}>
        <Images.SignupBackgroundZickZack />
      </div>
    </div>
  );
};

export default SignupContainer;
