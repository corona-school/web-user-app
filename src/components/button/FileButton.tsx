import React from 'react';
import classes from './FileButton.module.scss';
import Icons from '../../assets/icons';

export const FileButton = ({ name, linkToFile }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={classes.container}
      onClick={() => window.open(linkToFile, '_blank')}
    >
      <Icons.Pdf />
      <div className={classes.text}>{name}</div>
    </div>
  );
};
