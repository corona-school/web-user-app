import React from 'react';
import Card from './Card';
import Chip from './Chip';
import Information from './Information';
import Toolbar from './Toolbar';
import { User } from '../../types';

const SettingsPersonalCard: React.FC<{ user: User }> = ({ user }) => {
  const initials = user.firstname.charAt(0) + user.lastname.charAt(0);
  return (
    <Card>
      <Chip>{initials}</Chip>
      <Information
        title={user.firstname + ' ' + user.lastname}
        subtitle={user.email}
      >
        <strong>
          {user.type === 'pupil'
            ? `Schüler*in - ${user.grade}. Klasse`
            : 'Student*in'}
        </strong>
        {/* <em>Am 23.04.2020 angemeldet</em> */}
      </Information>
      <Toolbar></Toolbar>
    </Card>
  );
};

export default SettingsPersonalCard;
