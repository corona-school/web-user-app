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
              title="Kursarten"
              description={
                <div className={classes.stepDescription}>
                  Hier kannst du verschiedene Arten deines Kurses festlegen.
                </div>
              }
            />
            <Step
              className={classes.step}
              title="Termine"
              description={
                <div className={classes.stepDescription}>
                  Lege deine Termine für dein Kurs fest.
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
