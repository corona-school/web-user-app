/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useHistory } from 'react-router-dom';

import classes from './SignupContainer.module.scss';
import Images from '../../assets/images';

interface Props {
  shouldShowBackButton?: boolean;
}
const SignupContainer: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  shouldShowBackButton = true,
}) => {
  const history = useHistory();

  return (
    <div className={classes.container}>
      <div className={classes.contentBox}>
        <div className={classes.content}>
          {history.location.pathname !== '/login' && shouldShowBackButton && (
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
                }
              }}
            >
              Zurück
            </a>
          )}
          {children}
        </div>
        <div className={classes.legal}>
          <a href="https://www.lern-fair.de/datenschutz">
            Datenschutzerklärung
          </a>
          <a href="https://www.lern-fair.de/impressum">Impressum</a>
        </div>
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
