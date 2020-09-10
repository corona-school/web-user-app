import React from 'react';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import Button, { LinkButton } from '../button';

//import { CourseOverview } from '../../types/Course';

import classes from './FacebookCard.module.scss';
import { User } from '../../types';


interface Props {
    user: User;
  }

/*const onFacebook = () => {
  console.log("HI");
}*/




const FacebookCard: React.FC<Props> = ({ user }) => {
  return (
    <CardBase highlightColor="#F4486D" className={classes.baseContainer}>
        
        <Title size="h4" bold>Facebook Gruppe</Title>
        <Text>Du möchtest dich mit anderen Studierenden über Unterrichtsmethoden austauschen, hast organisatorische Fragen zur Plattform
            oder benötigst anderweitig Hilfe?
        </Text>
        <Text> Dann tritt unserer Facebook-Gruppe bei.</Text>
      

        <LinkButton
              className={classes.buttonParticipate}
              href={'https://www.facebook.com/groups/coronaschoolgermany'}
              target="_blank"
              style={{ margin: '4px' }}
            >
              Teilnehmen
            </LinkButton>
        
    </CardBase>
  );
};

export default FacebookCard;
