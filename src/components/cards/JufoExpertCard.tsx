import React, { useContext } from 'react';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';

import context from '../../context';

import classes from './JufoExpertCard.module.scss';
import Button from '../button';
import { ExpertOverviewModal } from '../Modals/ExpertOverviewModal';

export const JufoExpertCard: React.FC = () => {
  const modalContext = useContext(context.Modal);

  return (
    <>
      <CardBase highlightColor="#4E6AE6" className={classes.baseContainer}>
        <div className={classes.container}>
          <div className={classes.matchInfoContainer}>
            <Title size="h4" bold>
              Willst du Jufo Experte*in werden?
            </Title>
            <Text className={classes.emailText} large>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </div>
          <div className={classes.mainButtonContainer}>
            <Button
              onClick={() => modalContext.setOpenedModal('expertOverviewModal')}
              color="#ffffff"
              backgroundColor="#4E6AE6"
              style={{ margin: '4px' }}
            >
              Experten*innen angucken
            </Button>
            <Button
              onClick={() => modalContext.setOpenedModal('createExpertModal')}
              color="#ffffff"
              backgroundColor="#4E6AE6"
              style={{ margin: '4px' }}
            >
              Profil erstellen
            </Button>
          </div>
        </div>
      </CardBase>
      <ExpertOverviewModal />
    </>
  );
};
