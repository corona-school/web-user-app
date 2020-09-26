import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import {Checkbox, message} from 'antd';
import Button from '../button';
import Images from '../../assets/images';
import { Text, Title } from '../Typography';
import classes from './ContactCard.module.scss';
import { messageLabels } from '../../assets/mentoringPageAssets';
import { MentoringCategory } from '../../types/Mentoring';
import { ApiContext } from '../../context/ApiContext';
import { TopHighlightCard } from './FlexibleHighlightCard';

const ContactCard = () => {
  const apiContext = useContext(ApiContext);
  const theme = useContext(ThemeContext);

  const [category, setCategory] = useState<MentoringCategory>(
    MentoringCategory.LANGUAGE
  );
  const [emailText, setEmailText] = useState<string>('');
  const [agreementChecked, setAgreementChecked] = useState(false);

  const Reset = () => {
    setCategory(MentoringCategory.LANGUAGE);
    setEmailText('');
    setAgreementChecked(false);
  };

  const SendMessage = async () => {
    if (emailText.length === 0) {
      message.error('Der Text der Nachricht fehlt.');
    }
    if (!agreementChecked) {
      message.error('Bitte bestätige noch das Agreement');
    } else {
      await apiContext
        .postContactMentor({ category, emailText })
        .then(() => {
          message.success('Nachricht wurde versendet.');
          Reset();
        })
        .catch(() => message.error('Es ist ein Fehler aufgetreten.'));
    }
  };

  const FormContent = () => {
    return (
      <div className={classes.formContent}>
        <div className={classes.title}>
          <Title size="h3">Du hast Fragen?</Title>
        </div>
        <div className={classes.categorySelect}>
          <Text large> Kategorie: </Text>
          <select
            className={classes.selectElement}
            onChange={(e) => setCategory(MentoringCategory[e.target.value])}
            value={category}
          >
            {Object.values(MentoringCategory).map((c) => (
              <option value={c}>{messageLabels.get(c)}</option>
            ))}
          </select>
        </div>
        <div className={classes.image}>
          <Images.MentoringPic />
        </div>
        <div className={classes.input}>
          <textarea
            id="questionsMentoring"
            required
            className={classes.inputField}
            onChange={(e) => setEmailText(e.target.value)}
            value={emailText}
            rows={10}
          />
        </div>
        <div className={classes.checkboxCell}>
          <Checkbox
            className={classes.checkbox}
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
          >
            Agreement
          </Checkbox>
        </div>
        <div className={classes.buttonCell}>
          <Button className={classes.button} onClick={SendMessage}>
            Abschicken
          </Button>
        </div>
      </div>
    );
  };

  return (
    <TopHighlightCard highlightColor={theme.color.cardHighlightRed}>
      {FormContent()}
    </TopHighlightCard>
  );
};

export default ContactCard;
