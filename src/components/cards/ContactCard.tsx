import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Select, Input } from 'antd';
import { Title } from '../Typography';
import classes from './ContactCard.module.scss';
import Button from '../button/index';

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

  const submit = () => {
    console.log(`Send ${message} to ${recipient}`);
  };

  return (
    <div className={classes.container}>
      <Highlight highlightColor={cardColor} />
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
        <TextArea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button color="white" backgroundColor={cardColor} onClick={submit}>
          Abschicken
        </Button>
      </div>
    </div>
  );
};
