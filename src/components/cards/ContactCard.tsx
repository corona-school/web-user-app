import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Select, Input } from 'antd';
import { Title } from '../Typography';
import classes from './ContactCard.module.scss';

const { TextArea } = Input;

const Highlight = styled.div<{ highlightColor: string }>`
  height: 10px;
  background: ${(props) => props.highlightColor};
  margin-bottom: 5px;
`;

export const ContactCard = (props) => {
  const theme = useContext(ThemeContext);
  const [recipient, setRecipient] = useState(props.categories[0].value);
  const [message, setMessage] = useState('');

  return (
    <div className={classes.container}>
      <Highlight highlightColor={theme.color.cardHighlightRed} />
      <Title size="h4">Du hast Fragen?</Title>
      <Select
        value={recipient}
        onChange={(value) => setRecipient(value)}
        options={props.categories}
        style={{ width: 500 }}
      />
      <TextArea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  );
};
