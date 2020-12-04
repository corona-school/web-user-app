/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import StyledReactModal from 'styled-react-modal';
import { ModalContext } from '../../context/ModalContext';
import styles from './DialogModalBase.module.scss';
import { hexToRGB } from '../../utils/DashboardUtils';
import { ReactComponent as Cross } from '../../assets/icons/cancel-symbol.svg';
import { Checkbox as CheckboxBase } from '../button/Checkbox';
import AccentColorButton from '../button/AccentColorButton';

const DialogContext = React.createContext(null);

const DialogModalBase = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const api = useContext(ApiContext);
  const modalContext = useContext(ModalContext);
  const { accentColor } = props;
  const value = React.useMemo(() => ({ modalContext, accentColor }), [
    modalContext,
    accentColor,
  ]);

  return (
    <DialogContext.Provider value={value}>
      {props.children}
    </DialogContext.Provider>
  );
};

function useDialogContext() {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error(
      `Dialog compound components cannot be rendered outside the Dialog component`
    );
  }
  return context;
}

function closeModal(modalContext, stateSettingMethods) {
  modalContext.setOpenedModal(null);
  if (stateSettingMethods != null) {
    // can be optional
    stateSettingMethods.map(
      (method) => typeof method === 'function' && method(null)
    ); // Set all states stored in modal to null
  }
}

interface ModalProps {
  modalName: string;
}

const Modal: React.FC<ModalProps> = (props) => {
  const { modalContext } = useDialogContext();
  return (
    <StyledReactModal
      isOpen={
        modalContext.openedModal != null &&
        modalContext.openedModal === props.modalName
      }
    >
      <div className={styles.modal}>{props.children}</div>
    </StyledReactModal>
  );
};

const Title = (props) => {
  return <h1 className={styles.title}>{props.children}</h1>;
};

const Icon = ({ Icon }) => {
  const { accentColor } = useDialogContext();
  return (
    <div
      style={{ background: hexToRGB(accentColor, 0.18) }}
      className={styles.icon}
    >
      <Icon style={{ fill: accentColor }} />
    </div>
  );
};

interface CloseButtonProps {
  stateSettingMethods?: Array<any>;
  hook?: any;
}

const CloseButton: React.FC<CloseButtonProps> = (props) => {
  const { modalContext } = useDialogContext();
  const onClick = () => {
    if (props.hook != null) {
      props.hook();
    }
    closeModal(modalContext, props.stateSettingMethods);
  };
  return <Cross className={styles.close} onClick={onClick} />;
};

const Header = (props) => {
  return <div className={styles.header}>{props.children}</div>;
};

const Description = (props) => {
  return <p className={styles.description}>{props.children}</p>;
};

const Form = (props) => {
  return <div className={styles.form}>{props.children}</div>;
};

const Subheading = (props) => {
  return <h3 className={styles.subheading}>{props.children}</h3>;
};

const Content = (props) => {
  return <div className={styles.content}>{props.children}</div>;
};

const ButtonBox = (props) => {
  return <div className={styles.buttonBox}>{props.children}</div>;
};

const Button = (props) => {
  const { accentColor } = useDialogContext();
  return (
    <AccentColorButton
      onClick={props.onClick}
      label={props.label}
      accentColor={accentColor}
    />
  );
};

type InputCompoundDirection = 'horizontal' | 'vertical';
interface InputCompoundProps {
  direction: InputCompoundDirection;
}
const InputCompound: React.FC<InputCompoundProps> = (props) => {
  return (
    <div
      className={
        props.direction === 'horizontal'
          ? styles.inputCompoundH
          : styles.inputCompoundV
      }
    >
      {props.children}
    </div>
  );
};

interface CheckboxProps {
  value: any;
  checked: any;
  onSelect: any;
  label: string;
}
const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { accentColor } = useDialogContext();

  return (
    <CheckboxBase
      text={props.label}
      accentColor={accentColor}
      checked={props.checked}
      onClick={props.onSelect}
    />
  );
};

interface CheckboxSingleProps {
  value: any;
  selected: any;
  onSelect: any;
  label: string;
}
const CheckboxSingle: React.FC<CheckboxSingleProps> = (props) => {
  const { accentColor } = useDialogContext();

  return (
    <CheckboxBase
      text={props.label}
      accentColor={accentColor}
      checked={props.selected === props.value}
      onClick={() => props.onSelect(props.value)}
    />
  );
};

DialogModalBase.Modal = Modal;
DialogModalBase.Title = Title;
DialogModalBase.Icon = Icon;
DialogModalBase.Description = Description;
DialogModalBase.Subheading = Subheading;
DialogModalBase.Form = Form;
DialogModalBase.InputCompound = InputCompound;
DialogModalBase.Checkbox = Checkbox;
DialogModalBase.CheckboxSingle = CheckboxSingle;
DialogModalBase.Header = Header;
DialogModalBase.CloseButton = CloseButton;
DialogModalBase.Content = Content;
DialogModalBase.ButtonBox = ButtonBox;
DialogModalBase.Button = Button;

export default DialogModalBase;
