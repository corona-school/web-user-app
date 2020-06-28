import React from 'react';

import classes from './CourseContainer.module.scss';
import { Steps } from 'antd';

const { Step } = Steps;

interface Props {
  position: number;
}

export const CourseContainer: React.FC<Props> = (props) => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.stepContainer}>
          <Steps current={props.position}>
            <Step
              title="Kurs"
              description={
                <div className={classes.stepDescription}>
                  Allgemeine Informationen zu deinem Kurs
                </div>
              }
            />
            <Step
              title="Termine"
              description={
                <div className={classes.stepDescription}>
                  Lege Termine für deinen Kurs fest.
                </div>
              }
            />
            <Step
              className={classes.step}
              title="Fertig"
              description={
                <div className={classes.stepDescription}>
                  Dein Kurs wurde erfolgreich erstellt.
                </div>
              }
            />
          </Steps>
        </div>
        {props.children}
      </div>

      <div className={classes.background}></div>
    </div>
  );
};
