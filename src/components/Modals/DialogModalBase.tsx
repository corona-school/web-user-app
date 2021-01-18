/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import StyledReactModal from 'styled-react-modal';
import { ModalContext } from '../../context/ModalContext';
import styles from './DialogModalBase.module.scss';
import { hexToRGB } from '../../utils/DashboardUtils';
import { ReactComponent as Cross } from '../../assets/icons/cancel-symbol.svg';
import { Checkbox as CheckboxBase } from '../button/Checkbox';
import Textbox from '../misc/Textbox';
import AccentColorButton from '../button/AccentColorButton';
import Textarea from '../misc/Textarea';

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

/*
 Allows you to access properties of the DialogModalBase component from within its children
 */
function useDialogContext() {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw Error(
      `Dialog compound components cannot be rendered outside the Dialog component`
    );
  }
  return context;
}

/*
Closes the modal and clears all of the states that are part of it if passed
 */
function closeModal(modalContext, stateSettingMethods) {
  modalContext.setOpenedModal(null);
  if (stateSettingMethods != null) {
    // can be optional
    stateSettingMethods.map(
      (method) => typeof method === 'function' && method(null)
    ); // Set all states stored in modal to null
  }
}

/*
 The modal wrapper which includes the StyledReactModal component. Required the modalName parameter which is used to check if the modal should be open currently.
 */
const Modal: React.FC<{ modalName: string }> = (props) => {
  const { modalContext } = useDialogContext();
  return (
    <StyledReactModal
      isOpen={
        modalContext.openedModal != null &&
        modalContext.openedModal === props.modalName
      }
    >
      <div className={styles.modal}>
        <div className={styles.modalWrapper}>{props.children}</div>
      </div>
    </StyledReactModal>
  );
};

/*
Styled Title
 */
const Title = (props) => {
  return <h1 className={styles.title}>{props.children}</h1>;
};

/*
Styled icon in the top left of the modal. Pass the prop icon as a component. The icon has to be an SVG image as it gets filled with the accent color.
 */
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

/*
The close button on the top right of the modal. Pass your modal's state setting methods if you want to clear them when the user closes the modal. The function passed as "hook" will be called when the user clicks on the button.
 */
const CloseButton: React.FC<{
  stateSettingMethods?: Array<any>;
  hook?: any;
}> = (props) => {
  const { modalContext } = useDialogContext();
  const onClick = () => {
    if (props.hook != null) {
      props.hook();
    }
    closeModal(modalContext, props.stateSettingMethods);
  };
  return <Cross className={styles.close} onClick={onClick} />;
};

/*
Header component which is responsible for the layout of the icon, the title and the close button.
 */
const Header = (props) => {
  return <div className={styles.header}>{props.children}</div>;
};

/*
Styled description component
 */
const Description = (props) => {
  return <p className={styles.description}>{props.children}</p>;
};

/*
Styled block of text, wrapped in a div
 */
const TextBlock = (props) => {
  return <div className={styles.text}>{props.children}</div>;
};

/*
Indented component for forms
 */
const Form = (props) => {
  return <div className={styles.form}>{props.children}</div>;
};

/*
Styled subheading
 */
const Subheading = (props) => {
  return <h3 className={styles.subheading}>{props.children}</h3>;
};

/*
Styled label
 */
const Label = (props) => {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return <label className={styles.label}>{props.children}</label>;
};

/*
Assures that all elements within it can get as wide as 100% of the modal's width.
 */
const Content = (props) => {
  return <div className={styles.content}>{props.children}</div>;
};

const Spacer = () => {
  return <div className={styles.spacer} />;
};

/*
Responsible for aligning buttons next to each other
 */
const ButtonBox = (props) => {
  return <div className={styles.buttonBox}>{props.children}</div>;
};

/*
Error box
 */
const Error2 = (props) => {
  return <div className={styles.error}>{props.children}</div>;
};

/*
Uses the AccentColorButton component to create a button in the set accent color.
 */
const Button: React.FC<{
  onClick: any;
  label: string;
  accentColor?: string;
}> = (props) => {
  const { accentColor } = useDialogContext();
  return (
    <AccentColorButton
      onClick={props.onClick}
      label={props.label}
      accentColor={props.accentColor != null ? props.accentColor : accentColor}
    />
  );
};

/*
Uses the Textbox component to create a textbox.
 */
const TextBox: React.FC<{
  onChange: any;
  value: string;
  label: string;
}> = (props) => {
  return (
    <Textbox
      onChange={props.onChange}
      value={props.value}
      label={props.label}
    />
  );
};

/*
Uses the Textarea component to create a textarea.
 */
const TextArea: React.FC<{
  onChange: any;
  value: string;
  label: string;
}> = (props) => {
  return (
    <Textarea
      onChange={props.onChange}
      value={props.value}
      label={props.label}
    />
  );
};

type InputCompoundDirection = 'horizontal' | 'vertical';
interface InputCompoundProps {
  direction: InputCompoundDirection;
}
/*
Aligns e.g. input components. There are two directions: 'horizontal' and 'vertical'.
 */
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
/*
Creates a checkbox with the set accent color. Behaves like a normal checkbox.
 */
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
/*
Creates a checkbox with the set accent color. It behaves like radio buttons: You can only select one at a time.
Props:
value:  The value of the checkbox
selected:   The currently selected value (in your checkbox compound, *this is not a boolean*)
onSelect:   The function that should get called when the user clicks on the checkbox. This will likely be your state setting method.
 */
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
DialogModalBase.TextBlock = TextBlock;
DialogModalBase.Spacer = Spacer;
DialogModalBase.Subheading = Subheading;
DialogModalBase.Form = Form;
DialogModalBase.InputCompound = InputCompound;
DialogModalBase.Checkbox = Checkbox;
DialogModalBase.CheckboxSingle = CheckboxSingle;
DialogModalBase.Error = Error2;
DialogModalBase.Header = Header;
DialogModalBase.CloseButton = CloseButton;
DialogModalBase.Content = Content;
DialogModalBase.ButtonBox = ButtonBox;
DialogModalBase.Button = Button;
DialogModalBase.Error = Error2;
DialogModalBase.TextBox = TextBox;
DialogModalBase.TextBox = TextBox;
DialogModalBase.TextArea = TextArea;
DialogModalBase.Label = Label;

export default DialogModalBase;
