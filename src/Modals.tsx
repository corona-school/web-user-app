import React from 'react';
import { ContactJufoExpert } from './components/Modals/ContactJufoExpert';
import { ExpertOverviewModal } from './components/Modals/ExpertOverviewModal';

export const Modals: React.FC = () => {
  return (
    <>
      <ExpertOverviewModal />
      <ContactJufoExpert />
    </>
  );
};
