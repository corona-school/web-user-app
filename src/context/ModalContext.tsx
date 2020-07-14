import React, { useState } from 'react';
import { ModalProvider as StyledReactModalProvider, BaseModalBackground } from 'styled-react-modal';
import styled from 'styled-components';

export const ModalContext = React.createContext<{
  openedModal: string | null;
  setOpenedModal: (openedModal: string | null) => void;
}>({ openedModal: null, setOpenedModal: () => {} });

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openedModal, setOpenedModal] = useState<string | null>(
    'dissolveMatchModal'
  );

  //make the modal visible above everything else
  const CSModalBackground = styled(BaseModalBackground)`
    z-index: 1000;
    max-height: 100%;
  `

  return (
    <ModalContext.Provider value={{ openedModal, setOpenedModal }}>
      <StyledReactModalProvider backgroundComponent={CSModalBackground}>{children}</StyledReactModalProvider>
    </ModalContext.Provider>
  );
};
