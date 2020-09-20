import React, {useContext} from 'react';
import classes from './Header.module.scss';
import Icons from '../../assets/icons';
import Welcome from "./Welcome";
import {AuthContext} from "../../context/AuthContext";
import {UserContext} from "../../context/UserContext";

interface Props {
  setMenuOpen: (isMenuOpen: boolean) => void;
}

const Header = (props: Props) => {
  const authContext = useContext(AuthContext);
  const {
    user: {},
    user,
  } = useContext(UserContext);

  return (
    <div className={classes.header}>
      <Welcome user={user} />
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
