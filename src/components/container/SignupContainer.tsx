import React from 'react';

import classes from './SignupContainer.module.scss';
import Images from '../../assets/images';

const SignupContainer: React.FC = (props) => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>{props.children}</div>
      <div className={classes.background1}>
        <Images.SignupBackground1 />
      </div>

      <div className={classes.background2}>
        <Images.SignupBackground2 />
      </div>
      <div className={classes.background3}>
        <Images.SignupBackgroundCircle1 />
      </div>
      <div className={classes.background4}>
        <Images.SignupBackgroundCircle2 />
      </div>
      <div className={classes.background5}>
        <Images.SignupBackgroundZickZack />
      </div>
    </div>
  );
};

export default SignupContainer;
