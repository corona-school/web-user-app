import React from 'react';
import { ContactJufoExpert } from './components/Modals/ContactJufoExpert';
import { ExpertOverviewModal } from './components/Modals/ExpertOverviewModal';
import { JufoExpertDetail } from './components/Modals/JufoExpertDetail';

export const Modals: React.FC = () => {
  return (
    <>
      <ExpertOverviewModal />
      <ContactJufoExpert />
      <JufoExpertDetail />
    </>
  );
};
