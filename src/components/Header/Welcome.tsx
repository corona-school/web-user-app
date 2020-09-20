import React from 'react';
import classes from './Welcome.module.scss';
import Icons from '../../assets/icons';
import { User } from '../../types';
import { getUserType } from '../../utils/UserUtils';
import {Text, Title} from "../Typography";

interface Props {
  user: User;
}

const Welcome = (props: Props) => {
  const { user } = props;

  return (
    <div className={classes.navigationUser}>
      <div className={classes.icon}>
        <Icons.DefaultProfile />
      </div>
      <Title size="h4" className={classes.navigationName}>
        {`${user.firstname} ${user.lastname}`}
      </Title>
    </div>
  );
};

export default Welcome;
