import React, { useContext } from 'react';
import classnames from 'classnames';
import { UserContext } from '../../context/UserContext';
import Icons from '../../assets/icons';
import { ScreeningStatus } from '../../types';
import classes from './index.module.scss';
import { NavButton } from './NavButton';
import Welcome from './Welcome';
import { SocialMediaButton } from '../button';

interface Props {
  isMenuOpen: boolean;
  setMenuOpen: (isMenuOpen: boolean) => void;
}

const Navigation: React.FC<Props> = (props) => {
  // const authContext = useContext(AuthContext);
  const {
    user: {
      type,
      screeningStatus,
      instructorScreeningStatus,
      projectCoachingScreeningStatus,
      isInstructor,
      isProjectCoach,
      isParticipant,
      isTutor,
      isPupil,
      isProjectCoachee,
    },
    user,
  } = useContext(UserContext);

  // const history = useHistory();
  // const handleLogoutClick = () => {
  //   authContext.setCredentials({ id: '', token: '' });
  //   authContext.setStatus('missing');
  //   authContext.deleteStoredCredentials();
  //   history.push('/login');
  // };

  return (
    <div
      className={classnames(classes.navigationContainer, {
        [classes.menuOpen]: props.isMenuOpen,
      })}
    >
      <div className={classes.header}>
        <Icons.Logo />
        Lern-Fair
      </div>
      <div className={classes.navigationGroup}>
        <Welcome user={user} />
        <div className={classes.section}>Menü</div>
        {(isPupil || isTutor) && (
          <NavButton
            to="/dashboard"
            icon={<Icons.Home />}
            onClick={() => props.setMenuOpen(false)}
          >
            Startseite
          </NavButton>
        )}
        {(isParticipant || isInstructor) && (
          <NavButton
            to="/courses"
            icon={<Icons.Palm />}
            active={
              type === 'pupil' ||
              instructorScreeningStatus === ScreeningStatus.Accepted
            }
            onClick={() => props.setMenuOpen(false)}
          >
            Fokuswochen
          </NavButton>
        )}
        {(isPupil || isTutor || isInstructor) && (
          <NavButton
            to="/matches"
            icon={<Icons.Match />}
            active={
              type === 'pupil' ||
              screeningStatus === ScreeningStatus.Accepted ||
              instructorScreeningStatus === ScreeningStatus.Accepted
            }
            onClick={() => props.setMenuOpen(false)}
          >
            Lernunterstützung
          </NavButton>
        )}
        {(isProjectCoachee || isProjectCoach) && (
          <NavButton
            to="/project-coaching"
            icon={<Icons.ProjectCoachingIcon />}
            // type === 'pupil' || screeningStatus === ScreeningStatus.Accepted
            active={
              type === 'pupil' ||
              projectCoachingScreeningStatus === ScreeningStatus.Accepted
            }
            onClick={() => props.setMenuOpen(false)}
          >
            Projektcoaching
          </NavButton>
        )}
        {isTutor && (
          <NavButton
            to="/mentoring"
            icon={<Icons.Mentoring />}
            onClick={() => props.setMenuOpen(false)}
          >
            Mentoring
          </NavButton>
        )}
        {isTutor && (
          <NavButton
            to="/support"
            icon={<Icons.Support />}
            onClick={() => props.setMenuOpen(false)}
          >
            Hilfestellungen
          </NavButton>
        )}
        <NavButton
          to="/settings"
          icon={<Icons.Settings />}
          onClick={() => props.setMenuOpen(false)}
        >
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
            href="https://www.facebook.com/lernfair/"
            target="_blank"
            onClick={() => props.setMenuOpen(false)}
          />
          <SocialMediaButton
            icon="TwitterIcon"
            rel="noopener noreferrer"
            href="https://twitter.com/LernFair"
            target="_blank"
            onClick={() => props.setMenuOpen(false)}
          />
          <SocialMediaButton
            icon="InstagramIcon"
            rel="noopener noreferrer"
            href="https://www.instagram.com/lern.fair/"
            target="_blank"
            onClick={() => props.setMenuOpen(false)}
          />
        </div>
      </div>
      <div className={classes.logoutContainer}>
        {/*  <NavActionButton icon={<Icons.Logout />} onClick={handleLogoutClick}> */}
        {/*    Ausloggen */}
        {/*  </NavActionButton> */}
      </div>
    </div>
  );
};

export default Navigation;
