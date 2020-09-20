import React, { useContext } from 'react';
import { Dropdown, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import classes from './Header.module.scss';
import Icons from '../../assets/icons';
import Welcome from './Welcome';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { Title } from '../Typography';

interface Props {
  setMenuOpen: (isMenuOpen: boolean) => void;
}

const Header = (props: Props) => {
  const authContext = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const history = useHistory();

  const handleLogout = () => {
    authContext.setCredentials({ id: '', token: '' });
    authContext.setStatus('missing');
    authContext.deleteStoredCredentials();
    history.push('/login');
  };

  const logout = (
    <Menu>
      <Menu.Item>
        <div
          className={classes.logout}
          onClick={handleLogout}
          role="button"
          tabIndex={0}
        >
          <Icons.Logout />
          <Title size="h5">Ausloggen</Title>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={classes.header}>
      <Dropdown overlay={logout}>
        <div className={classes.avatar}>
          <Welcome user={user} />
        </div>
      </Dropdown>
      <button
        type="button"
        className={classes.mobileNav}
        onClick={() => props.setMenuOpen(true)}
      >
        <Icons.MenuIcon />
      </button>
    </div>
  );
};

export default Header;
