import React from 'react';

import { LinkButton } from '../components/button';
import ContactCard from '../components/cards/ContactCard';
import FeedbackCallCard from '../components/cards/FeedbackCallCard';
import { Text, Title } from '../components/Typography';

import classes from './Mentoring.module.scss';
import FacebookCard from '../components/cards/FacebookCard';
import {
  headerText,
  moreInformationButtonLink,
} from '../assets/mentoringPageAssets';
import StudentCheck from '../components/StudentCheck';
import AccountNotScreenedModal from '../components/Modals/AccountNotScreenedModal';

const Mentoring: React.FC = () => {
  StudentCheck();

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
          <FeedbackCallCard />
        </div>
        <div className={classes.facebookCard}>
          <FacebookCard />
        </div>
      </div>
      <AccountNotScreenedModal />
    </div>
  );
};

export default Mentoring;
