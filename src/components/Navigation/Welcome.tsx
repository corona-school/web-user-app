import React from 'react';
import classes from './Welcome.module.scss';
import Icons from '../../assets/icons';
import { User } from '../../types';
import { getUserType } from '../../utils/UserUtils';

interface Props {
  user: User;
}

const Welcome = (props: Props) => {
  return (
    <div className={classes.navigationUser}>
      <div className={classes.icon}>
        <Icons.DefaultProfile width="100%" />
      </div>
      <div className={classes.navigationName}>Hallo {props.user.firstname}</div>
      <div className={classes.navigationUserType}>
        {getUserType(props.user)}
      </div>
    </div>
  );
};

export default Welcome;
