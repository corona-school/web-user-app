import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import Context from '../context';
import { ScreeningStatus } from '../types';
import MentorCard from '../components/cards/MentorCard';
import SupportCard from '../components/cards/SupportCard';
import { Text, Title } from '../components/Typography';
import { headerText, cardText1, cardText2 } from '../assets/supportTexts';

import classes from './Support.module.scss';
import { FileButton } from '../components/button/FileButton';

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

  const MaterialCard1 = () => {
    return (
      <div>
        <Title size="h4">
          <b>Materialien</b> für einen erfolgreichen Einstieg
        </Title>
        <Text>{cardText1}</Text>
      </div>
    );
  };

  const MaterialCard2 = () => {
    return (
      <div>
        <Title size="h4">
          <b>Materialien</b> zur Unterrichtsgestaltung
        </Title>
        <Text>{cardText2}</Text>
        <div className={classes.links}>
          <FileButton name="Test2" linkToFile="abc.de" />
          <FileButton name="Test1" linkToFile="google.de" />
          <FileButton name="Test2" linkToFile="abc.de" />
        </div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <Title>Hilfestellungen</Title>
      <Text large>{headerText}</Text>
      <div className={classes.materials}>
        <SupportCard>
          <MaterialCard1 />
        </SupportCard>
        <SupportCard>
          <MaterialCard2 />
        </SupportCard>
      </div>

      <Title>
        Hilfreiche Videos <Title size="h3">Playlist</Title>
      </Title>
      <div>
        <Wrapper>
          {userContext.user.subjects.map((subject) => (
            <MentorCard
              key={subject.name}
              subject={subject}
              // type={userContext.user.type}
            />
          ))}
        </Wrapper>
      </div>
    </div>
  );
};

export default Support;
