import React from 'react';
import classes from './Header.module.scss';
import Icons from '../assets/icons';

interface Props {
  setMenuOpen: (isMenuOpen: boolean) => void;
}

const Header = (props: Props) => {
  return (
    <div className={classes.header}>
      <Icons.WirVsVirusLogo />
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
