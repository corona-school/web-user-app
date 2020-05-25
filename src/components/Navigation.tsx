import React, { ReactElement, useContext } from 'react';
import styled from 'styled-components';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserContext, defaultUser } from '../context/UserContext';
import storedCredentials from '../api/storedCredentials';
import Icons from '../assets/icons';
import { ScreeningStatus } from '../types';

const NavWrapper = styled.div`
  background-color: ${(props) => props.theme.color.navigationBackground};
  color: ${(props) => props.theme.color.navigationText};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
  overflow: auto;
  width: 270px;

  .navigation-user {
    flex-grow: 1;
    padding: 18px;
    /* white-space: nowrap; */
  }

  .navigation-name {
    font-size: 20px;
    line-height: 30px;
  }

  .navigation-group {
    display: flex;
    flex-direction: column;
    flex-grow: 3;
  }
`;

const StyledNavLink = styled(NavLink).withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    !['center', 'active'].includes(prop),
})<{
  center?: boolean;
  active?: boolean;
}>`
  align-items: center;
  color: ${(props) => props.theme.color.navigationText};
  display: flex;
  font-size: 18px;
  padding: 0.92em 1.39em;
  text-decoration: none;

  svg {
    fill: ${(props) => props.theme.color.navigationText};
    height: 1.39em;
    width: 1.39em;
    margin-right: 0.89em;
  }

  &.active {
    background-color: ${(props) => props.theme.color.navigationActive};
  }

  &:hover {
    background-color: ${(props) => props.theme.color.navigationHover};
  }

  ${(props) =>
    props.center &&
    `
    justify-content: center;
    padding: 31px 0;
  `}
  ${(props) =>
    !props.active &&
    `
    opacity: 0.25;
    pointer-events: none;
    `}
`;

const NavButton: React.FC<{
  to: string;
  icon?: ReactElement;
  center?: boolean;
  active?: boolean;
}> = ({ to, icon, children, center = false, active = true }) => {
  return (
    <StyledNavLink to={to} center={center} active={active}>
      {icon}
      {children}
    </StyledNavLink>
  );
};

const NavActionButton: React.FC<{
  icon?: ReactElement;
  onClick: () => void;
  active?: boolean;
}> = ({ icon, onClick, children, active = true }) => (
  <StyledNavLink as="button" center={true} onClick={onClick} active={active}>
    {icon}
    {children}
  </StyledNavLink>
);

const Navigation: React.FC = () => {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const history = useHistory();

  const handleLogoutClick = () => {
    authContext.setCredentials({ id: '', token: '' });
    authContext.setStatus('pending');
    authContext.deleteStoredCredentials();
    history.push('/login');
  };

  return (
    <NavWrapper>
      <div className="navigation-user">
        <span className="navigation-name">
          {userContext.user.firstname + ' ' + userContext.user.lastname}
        </span>
        <br />
        <span className="navigation-type">
          {userContext.user.type === 'pupil' ? 'Schüler*in' : 'Student*in'}
        </span>
      </div>
      <div className="navigation-group">
        {/* <NavButton to="/dashboard" icon={<Icons.Home />}>
          Startseite
        </NavButton> */}
        <NavButton
          to="/matches"
          icon={<Icons.Match />}
          active={
            userContext.user.type === 'pupil' ||
            userContext.user.screeningStatus === ScreeningStatus.Accepted
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
      </div>
      <NavActionButton icon={<Icons.Logout />} onClick={handleLogoutClick}>
        Ausloggen
      </NavActionButton>
    </NavWrapper>
  );
};

export default Navigation;
