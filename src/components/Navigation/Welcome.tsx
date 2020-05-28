import React from 'react';
import classes from './Welcome.module.scss';
import Icons from '../../assets/icons';

interface Props {
  firstname: string;
  type: 'student' | 'pupil';
}

const Welcome = (props: Props) => {
  return (
    <div className={classes.navigationUser}>
      <div className={classes.icon}>
        <Icons.DefaultProfile width="100%" />
      </div>
      <div className={classes.navigationName}>Hallo {props.firstname}</div>
      <div className={classes.navigationUserType}>
        {props.type === 'pupil' ? 'Schüler*in' : 'Student*in'}
      </div>
    </div>
  );
};

export default Welcome;
