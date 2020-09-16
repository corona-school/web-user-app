import React from 'react';
import classes from './FileButton.module.scss';
import Icons from '../../assets/icons';
import { Text } from '../Typography';

export const FileButton = ({ name, linkToFile }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={classes.container}
      onClick={() => window.open(linkToFile, '_blank')}
    >
      <Icons.Pdf />
      <Text className={classes.text}>{name}</Text>
    </div>
  );
};
