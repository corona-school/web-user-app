import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Select, Input, Checkbox } from 'antd';
import { Title } from '../Typography';
import classes from './ContactCard.module.scss';
import Button from '../button/index';
import Icons from '../../assets/icons';

const { TextArea } = Input;

const Highlight = styled.div<{ highlightColor: string }>`
  height: 10px;
  background: ${(props) => props.highlightColor};
  margin-bottom: 5px;
`;

export const ContactCard = (props) => {
  const cardColor = useContext(ThemeContext).color.cardHighlightRed;
  const [recipient, setRecipient] = useState(props.categories[0].value);
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<'init' | 'failed' | 'sent'>(
    'init'
  );
  const [checkAgreement, setCheckAgreement] = useState(false);

  const reset = () => {
    setRecipient(props.categories[0].value);
    setMessage('');
    setFormState('init');
    setCheckAgreement(false);
  };

  const submit = () => {
    if (checkAgreement) {
      console.log(`Send ${message} to ${recipient}`);
      setFormState('sent');
    } else setFormState('failed');
  };

  const Content = () => {
    return (
      <div className={classes.content}>
        <Title size="h4" style={{ marginLeft: '0px' }}>
          Du hast Fragen?
        </Title>
        <div className={classes.categorySelect}>
          {'Kategorie: '}
          <Select
            value={recipient}
            onChange={(value) => setRecipient(value)}
            options={props.categories}
            style={{ marginLeft: 10, minWidth: 430 }}
          />
        </div>
        <Icons.Studying />
        <TextArea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Checkbox
          checked={checkAgreement}
          onChange={(e) => setCheckAgreement(e.target.checked)}
        >
          Agreement
        </Checkbox>
        {formState === 'failed' && (
          <div style={{ color: 'red' }}>
            Bitte bestätige noch das Agreement.
          </div>
        )}
        <Button color="white" backgroundColor={cardColor} onClick={submit}>
          Abschicken
        </Button>
      </div>
    );
  };

  const Confirmation = () => {
    return (
      <div className={classes.content}>
        <Title size="h4" style={{ marginLeft: '0px' }}>
          Danke für deine Nachricht!
        </Title>
        <Button color="white" backgroundColor={cardColor} onClick={reset}>
          Noch eine Nachricht
        </Button>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <Highlight highlightColor={cardColor} />
      {formState !== 'sent' && Content()}
      {formState === 'sent' && Confirmation()}
    </div>
  );
};
