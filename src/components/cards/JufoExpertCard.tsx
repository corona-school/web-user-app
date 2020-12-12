import React, { useContext } from 'react';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';

import context from '../../context';

import classes from './JufoExpertCard.module.scss';
import Button from '../button';
import { ExpertOverviewModal } from '../Modals/ExpertOverviewModal';
import EditExpertProfileModal from '../Modals/EditExpertProfileModal';

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
              onClick={() =>
                modalContext.setOpenedModal('editExpertProfileModal')
              }
              color="#ffffff"
              backgroundColor="#4E6AE6"
              style={{ margin: '4px' }}
            >
              Profil erstellen
            </Button>
          </div>
        </div>
      </CardBase>
      <EditExpertProfileModal
        avatar={() => ({ className }) => {
          return (
            <img
              className={className}
              alt="avatar"
              src="https://www.lensmen.ie/wp-content/uploads/2015/02/Profile-Portrait-Photographer-in-Dublin-Ireland.-1030x1030.jpg"
            />
          );
        }}
      />
      <ExpertOverviewModal />
    </>
  );
};
