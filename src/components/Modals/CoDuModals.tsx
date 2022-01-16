import StyledReactModal from 'styled-react-modal';
import React, { useContext, useState } from 'react';
import context from '../../context';
import classes from './CoDuModals.module.scss';
import DialogModalBase from './DialogModalBase';
import { ReactComponent as Checkmark } from '../../assets/icons/check-double-solid.svg';
import {
  becomeCoDuErrorText,
  introductionText,
  subjectErrorText,
} from '../../assets/coDuAssets';
import { checkCoDuSubjectRequirements } from '../../utils/SubjectUtil';

const accentColor = '#FFCC12';

export const CoDuSubjectErrorModal = () => {
  const modalContext = useContext(context.Modal);

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'coDuSubjectErrorModal'}
      onEscapeKeydown={() => modalContext.setOpenedModal('')}
      onBackgroundClick={() => modalContext.setOpenedModal('')}
    >
      <div className={classes.subjectErrorModal}>{subjectErrorText}</div>
    </StyledReactModal>
  );
};

export const BecomeCoDuStudentModal: React.FC<{
  requestNewMatch: (isCodu: boolean) => void;
}> = ({ requestNewMatch }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const userContext = useContext(context.User);
  const modalContext = useContext(context.Modal);

  const processDecision = (isCodu: boolean) => {
    requestNewMatch(isCodu);
    modalContext.setOpenedModal(null);
  };

  return (
    <DialogModalBase accentColor={accentColor}>
      <DialogModalBase.Modal modalName="becomeCoDuStudentModal">
        <DialogModalBase.Header>
          <DialogModalBase.Icon Icon={Checkmark} />
          <DialogModalBase.Title>Neues Match anfordern</DialogModalBase.Title>
          <DialogModalBase.CloseButton hook={() => setPageIndex(0)} />
        </DialogModalBase.Header>

        {pageIndex === 0 && (
          <>
            <DialogModalBase.TextBlock>
              {introductionText}
            </DialogModalBase.TextBlock>

            <DialogModalBase.Content>
              <DialogModalBase.Form>
                <DialogModalBase.ButtonBox>
                  <DialogModalBase.Button
                    label="An der CoDu-Studie teilnehmen"
                    onClick={() =>
                      !checkCoDuSubjectRequirements(userContext.user.subjects)
                        ? setPageIndex(1)
                        : processDecision(true)
                    }
                  />
                  <DialogModalBase.Button
                    label="Nicht teilnehmen"
                    onClick={() => processDecision(false)}
                  />
                </DialogModalBase.ButtonBox>
              </DialogModalBase.Form>
            </DialogModalBase.Content>
          </>
        )}

        {pageIndex === 1 && (
          <>
            <DialogModalBase.TextBlock>
              {becomeCoDuErrorText}
            </DialogModalBase.TextBlock>
            <DialogModalBase.Content>
              <DialogModalBase.Form>
                <DialogModalBase.ButtonBox>
                  <DialogModalBase.Button
                    label="Okay"
                    onClick={() => modalContext.setOpenedModal(null)}
                  />
                </DialogModalBase.ButtonBox>
              </DialogModalBase.Form>
            </DialogModalBase.Content>
          </>
        )}
      </DialogModalBase.Modal>
    </DialogModalBase>
  );
};
