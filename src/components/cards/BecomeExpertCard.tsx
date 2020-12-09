import React, { useContext } from 'react';
import CardBase from '../base/CardBase';
import classes from './SettingsCard.module.scss';
import { Title } from '../Typography';
import AccentColorButton from '../button/AccentColorButton';
import Context from '../../context';
import EditExpertProfileModal from '../Modals/EditExpertProfileModal';

export default function BecomeExpertCard() {
  const modalContext = useContext(Context.Modal);

  return (
    <CardBase highlightColor="#F4486D" className={classes.baseContainer}>
      <div className={classes.container}>
        <div className={classes.matchInfoContainer}>
          <Title size="h4" bold>
            Willst du Experte*in werden?
          </Title>
          <AccentColorButton
            accentColor="#F4486D"
            label="Profil erstellen"
            onClick={() =>
              modalContext.setOpenedModal(`editExpertProfileModal`)
            }
          />
        </div>
      </div>
      <EditExpertProfileModal />
    </CardBase>
  );
}
