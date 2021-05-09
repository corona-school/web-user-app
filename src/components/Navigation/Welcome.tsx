import React from 'react';
import classes from './Welcome.module.scss';
import Icons from '../../assets/icons';
import { User } from '../../types';
import { getUserTags } from '../../utils/UserUtils';

interface Props {
  user: User;
}

const Welcome = (props: Props) => {
  const { user } = props;

  return (
    <div className={classes.navigationUser}>
      <div className={classes.icon}>
        <Icons.DefaultProfile width="100%" />
      </div>
      <div className={classes.navigationName}>Hallo {user.firstname}</div>
      <div className={classes.navigationUserType}>
        {String(getUserTags(user).map((x) => ` ${x}`))}
      </div>
    </div>
  );
};

export default Welcome;
