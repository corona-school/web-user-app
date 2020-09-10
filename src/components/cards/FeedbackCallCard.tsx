import React from 'react';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';

import Button, { LinkButton } from '../button';
//import { CourseOverview } from '../../types/Course';

import classes from './FeedbackCallCard.module.scss';
import { User } from '../../types';

interface Props {
    user: User;
  }

const FeedbackCallCard: React.FC<Props> = ({ user }) => {
  return (
    <CardBase highlightColor="#F4486D" className={classes.baseContainer}>
        <Title size="h4" bold>Feedback Call</Title>
        <Text style={{ color: 'rgb(244, 72, 109)' }}>10.06.2020 17:30 Uhr</Text>
        <Text>Du hast Lust, dich mit anderen Studierenden über deine Erfahrungen und Herausforderungen bei der Online-Nachhilfe auszutauschen?
            Dann bist du herzlich zu unseren gemeinsamen Feedback-Calls eingeladen. Der passende Link wird immer am Tag des Calls
            veröffentlicht.
        </Text>
        <LinkButton
              className={classes.buttonParticipate}
              href={'https://meet.jit.si/corona-school-33fb9iu9348w258d2'}  
              target="_blank"
              style={{ margin: '4px' }}
             
            >
              Teilnehmen
            </LinkButton>
    </CardBase>
  );
};

export default FeedbackCallCard;
