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
      <div
        className={classes.mobileNav}
        onClick={() => props.setMenuOpen(true)}
      >
        <Icons.MenuIcon />
      </div>
    </div>
  );
};

export default Header;
