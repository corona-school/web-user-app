import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import Context from '../context';

import Button, { LinkButton } from '../components/button';
//import Icons from '../assets/icons';
import { ScreeningStatus } from '../types';
import MentoringCard from '../components/cards/MentoringCard';
import FeedbackCallCard from '../components/cards/FeedbackCallCard';
import MentorCard from '../components/cards/MentorCard';
import { Text, Title } from '../components/Typography';
//import Images from '../assets/images';

import classes from './Mentoring.module.scss';
import FacebookCard from '../components/cards/FacebookCard';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 !important;
`;


const Mentoring: React.FC = () => {
  const modalContext = useContext(Context.Modal);
  const userContext = useContext(Context.User);

  useEffect(() => {
    if (
      userContext.user.screeningStatus === ScreeningStatus.Unscreened ||
      (userContext.user.isInstructor &&
        userContext.user.instructorScreeningStatus ===
          ScreeningStatus.Unscreened)
    ) {
      modalContext.setOpenedModal('accountNotScreened');
    }
  }, [userContext.user.screeningStatus]);

  return (
    <div className={classes.container}>
      <Title>Mentoring</Title>
      <Text>Online-Nachhilfe ist möglicherweise auch für dich eine neue Erfahrung, welche viele Fragen und Schwierigkeiten aufwirft.
          Damit bist du nicht allein! Wir haben ein Mentoring-Programm entwickelt, um dich optimal zu unterstützen. Mentor*innen der Corona
          School zeichnen sich durch ihre Berufserfahrung und Expertise in verschiedenen Bereichen aus. Hier kannst du deine Fragen loswerden
          und wertvolle Tipps für gute, digitale Zusammenarbeit erhalten. Darüber hinaus kannst du dich mit anderen Studierenden bei
          Feedback-Calls oder in der Facebook-Gruppe austauschen.
      </Text>
      <LinkButton
        className={classes.buttonMoreInfo}
        href="https://drive.google.com/file/d/1UvrOSlS3nF_Bk-0hGlnBwzf0xWBm3cKQ/view"
        target="_blank"
      >
        Weitere Informationen
      </LinkButton>
      <Wrapper>
          <MentoringCard user={userContext.user} />
          <div>
          <FeedbackCallCard user={userContext.user}/>
          <FacebookCard user={userContext.user}/>
          </div>
      </Wrapper>



    </div>
  );
};

export default Mentoring;
