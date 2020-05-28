import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import Icons from '../../assets/icons';
import { ScreeningStatus } from '../../types';
import classes from './index.module.scss';
import { NavButton, NavActionButton } from './NavButton';
import { useHistory } from 'react-router-dom';
import Welcome from './Welcome';
import IconButton, { SocialMediaButton } from '../buttons/IconButton';

const Navigation: React.FC = () => {
  const authContext = useContext(AuthContext);
  const {
    user: { firstname, type, screeningStatus },
  } = useContext(UserContext);
  const history = useHistory();

  const handleLogoutClick = () => {
    authContext.setCredentials({ id: '', token: '' });
    authContext.setStatus('pending');
    authContext.deleteStoredCredentials();
    history.push('/login');
  };

  return (
    <div className={classes.navigationContainer}>
      <div className={classes.header}>
        <Icons.Logo />
        Corona School
      </div>
      <div className={classes.navigationGroup}>
        <Welcome firstname={firstname} type={type} />
        <div className={classes.section}>Menü</div>
        <NavButton to="/dashboard" icon={<Icons.Home />} active={false}>
          Startseite
        </NavButton>
        <NavButton
          to="/matches"
          icon={<Icons.Match />}
          active={
            type === 'pupil' || screeningStatus === ScreeningStatus.Accepted
          }
        >
          Zuordnung
        </NavButton>
        <NavButton to="/settings" icon={<Icons.Settings />}>
          Verwaltung
        </NavButton>
        {/* <NavButton to="/feedback" icon={<Icons.Feedback />}>
          Feedback
        </NavButton>
        <NavButton to="/help" icon={<Icons.Help />}>
          Hilfe
        </NavButton> */}
        <div className={classes.section}>Social Media</div>
        <div className={classes.socialMediaButtons}>
          <SocialMediaButton
            icon="FacebookIcon"
            rel="noopener noreferrer"
            href="https://www.facebook.com/coronaschoolgermany"
            target="_blank"
          />
          <SocialMediaButton
            icon="TwitterIcon"
            rel="noopener noreferrer"
            href="https://twitter.com/_CoronaSchool"
            target="_blank"
          />
          <SocialMediaButton
            icon="InstagramIcon"
            rel="noopener noreferrer"
            href="https://www.instagram.com/coronaschoolgermany/"
            target="_blank"
          />
        </div>
      </div>
      <NavActionButton icon={<Icons.Logout />} onClick={handleLogoutClick}>
        Ausloggen
      </NavActionButton>
    </div>
  );
};

export default Navigation;
