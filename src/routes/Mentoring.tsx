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
import {
  headerText,
  moreInformationButtonLink
} from "../assets/mentoringPageAssets";

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
      <Text>{headerText}</Text>
      <LinkButton
        className={classes.buttonMoreInfo}
        href={moreInformationButtonLink}
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
