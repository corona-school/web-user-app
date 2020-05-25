import React, { useState } from 'react';
import { ModalProvider as StyledReactModalProvider } from 'styled-react-modal';

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

  return (
    <ModalContext.Provider value={{ openedModal, setOpenedModal }}>
      <StyledReactModalProvider>{children}</StyledReactModalProvider>
    </ModalContext.Provider>
  );
};
