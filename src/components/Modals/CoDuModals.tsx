import StyledReactModal from 'styled-react-modal';
import React, { useContext } from 'react';
import context from '../../context';
import classes from './CoDuModals.module.scss';

export const CoDuSubjectErrorModal = () => {
  const modalContext = useContext(context.Modal);

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'coDuSubjectErrorModal'}
      onEscapeKeydown={() => modalContext.setOpenedModal('')}
      onBackgroundClick={() => modalContext.setOpenedModal('')}
    >
      <div className={classes.subjectErrorModal}>
        Du nimmst an der CoDu-Studie teil. Daher musst du mindestens eines der
        Fächer <strong>Mathematik, Deutsch oder Englisch</strong> anbieten.
        Zusätzlich musst du eines dieser Fächer für mindestens eine{' '}
        <strong>Klassenstufe zwischen 8 und 10 </strong>
        gewählt haben.
        <br />
        Wenn du überzeugt bist, dass es sich dabei um einen Fehler handelt,
        wende dich bitte an{' '}
        <a href="mailto:support@lern-fair.de">support@lern-fair.de</a>.
      </div>
    </StyledReactModal>
  );
};
