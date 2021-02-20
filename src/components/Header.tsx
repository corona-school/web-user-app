import React from 'react';
import classes from './Header.module.scss';
import Icons from '../assets/icons';

interface Props {
  setMenuOpen: (isMenuOpen: boolean) => void;
}

const Header = (props: Props) => {
  return (
    <div className={classes.header}>
      <a
        className={classes.backToWebsiteWrapperLink}
        href="https://www.corona-school.de/"
      >
        <div className={classes.backToWebsiteWrapper}>
          <span className={classes.backToWebsite}>Zurück zur Website</span>
        </div>
      </a>

      <Icons.WirVsVirusLogo className={classes.wirVsVirus} />
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
