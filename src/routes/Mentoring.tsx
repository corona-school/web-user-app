import React, {useContext, useEffect} from 'react';
import styled from 'styled-components';
import Context from '../context';

import Button, {LinkButton} from '../components/button';
//import Icons from '../assets/icons';
import {ScreeningStatus} from '../types';
import ContactCard from '../components/cards/ContactCard';
import FeedbackCallCard from '../components/cards/FeedbackCallCard';
import MentorCard from '../components/cards/MentorCard';
import {Text, Title} from '../components/Typography';
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
      <div className={classes.header}>
        <Title>Mentoring</Title>
        <Text>{headerText}</Text>
        <LinkButton
          className={classes.buttonMoreInfo}
          href={moreInformationButtonLink}
          target="_blank"
        >
          Weitere Informationen
        </LinkButton>
      </div>
      <div className={classes.cards}>
        <div className={classes.contactCard}>
          <ContactCard />
        </div>
        <div className={classes.feedbackCall}>
          <FeedbackCallCard user={userContext.user} />
        </div>
        <div className={classes.facebookCard}>
          <FacebookCard />
        </div>
      </div>
    </div>
  );
};

export default Mentoring;
