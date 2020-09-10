import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import Context from '../context';

import Button, { LinkButton } from '../components/button';
//import Icons from '../assets/icons';
import { ScreeningStatus } from '../types';
import MentorCard from '../components/cards/MentorCard';
import SupportCard1 from '../components/cards/SupportCard1';
import SupportCard2 from '../components/cards/SupportCard2';
import { Text, Title } from '../components/Typography';
//import Images from '../assets/images';

import classes from './Support.module.scss';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 !important;
`;



const Support: React.FC = () => {
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
      <Title>Hilfestellungen</Title>
      <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
      </Text>
          <SupportCard1 user={userContext.user}/>
          <SupportCard2 user={userContext.user}/>
      <Title>Hilfreiche Videos <Title size="h3">Playlist</Title></Title>
      <div>
        <Wrapper>
          {userContext.user.subjects.map((subject) => (
            <MentorCard
              key={subject.name}
              subject={subject}
              //type={userContext.user.type}
            />

          ))}
        </Wrapper>
      </div>
    </div>
  );
};

export default Support;
