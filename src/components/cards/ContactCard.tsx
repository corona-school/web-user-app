import React, { useContext, useState } from 'react';
import { ThemeContext } from 'styled-components';
import { Checkbox, message } from 'antd';
import Images from '../../assets/images';
import { Text, Title } from '../Typography';
import classes from './ContactCard.module.scss';
import { AgreementText, messageLabels } from '../../assets/mentoringPageAssets';
import { MentoringCategory } from '../../types/Mentoring';
import { ApiContext } from '../../context/ApiContext';
import { TopHighlightCard } from './FlexibleHighlightCard';
import Select from '../misc/Select';
import AccentColorButton from '../button/AccentColorButton';

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
      message.error('Bitte bestätige noch die Datenschutzerklärung.');
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
          <Title size="h3" style={{ marginBottom: '8px' }}>
            Du hast Fragen?
          </Title>
          <Text large style={{ marginTop: '0px' }}>
            Wähle eine Kategorie für dein Anliegen aus und bekomme
            Hilfestellungen von unseren Expert*innen.
          </Text>
        </div>
        <div className={classes.categorySelect}>
          <Text large> Kategorie: </Text>
          <Select
            className={classes.selectElement}
            onChange={(e) => setCategory(e.target.value as MentoringCategory)}
            value={category}
          >
            {Object.values(MentoringCategory).map((c) => (
              <option value={c}>{messageLabels.get(c)}</option>
            ))}
          </Select>
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
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
          />
          <Text className={classes.checkbox}>{AgreementText}</Text>
        </div>
        <div className={classes.buttonCell}>
          <AccentColorButton
            onClick={SendMessage}
            accentColor="#F4486D"
            label="Abschicken"
            small
          />
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
