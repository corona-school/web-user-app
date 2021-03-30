import React from 'react';
import classes from './Header.module.scss';
import Icons from '../assets/icons';
import { ExpertSearch } from './search/ExpertSearch';

interface Props {
  setMenuOpen: (isMenuOpen: boolean) => void;
}

const Header = (props: Props) => {
  return (
    <div className={classes.header}>
      <Icons.WirVsVirusLogo />
      <div className={classes.leftHeader}>
        <button
          type="button"
          className={classes.mobileNav}
          onClick={() => props.setMenuOpen(true)}
        >
          <Icons.MenuIcon />
        </button>
        <div className={classes.expertSearch}>
          <ExpertSearch placeHolder="Hier nach Expert*innen für dein Thema suchen..." />
        </div>
      </div>
    </div>
  );
};

export default Header;
