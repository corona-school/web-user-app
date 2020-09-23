import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Checkbox } from 'antd';
import Button from '../button';
import Images from '../../assets/images';
import { Text, Title } from '../Typography';
import classes from './ContactCard.module.scss';
import { messageLabels } from '../../assets/mentoringPageAssets';
import { MentoringCategory } from '../../types/Mentoring';
import { ApiContext } from '../../context/ApiContext';
import { TopHighlightCard } from './FlexibleHighlightCard';

const SelectStyle = styled.select`
  width: 310px;
  height: 28px;
  padding: 2px 5px;
  border: 1px solid ${(props) => props.theme.colorScheme.gray1};
  box-sizing: border-box;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: -0.333333px;
  color: border-color: rgb(244, 72, 109);
  border-color: rgb(244, 72, 109)
`;

enum FormStates {
  INIT,
  REVISE,
  SUCCESS,
  FAILED,
}

const ContactCard = () => {
  const apiContext = useContext(ApiContext);
  const theme = useContext(ThemeContext);

  const [formState, setFormState] = useState<FormStates>(FormStates.INIT);
  const [category, setCategory] = useState<MentoringCategory>(
    MentoringCategory.LANGUAGE
  );
  const [message, setMessage] = useState<string>('');
  const [agreementChecked, setAgreementChecked] = useState(false);

  const PrintWarnings = () => {
    if (message.length === 0) {
      return 'Das Textfeld ist leer.';
    }
    if (!agreementChecked) {
      return 'Bitte bestätige noch das Agreement.';
    }
    return '';
  };

  const SendMessage = async () => {
    if (message.length === 0 || !agreementChecked) {
      setFormState(FormStates.REVISE);
    } else {
      await apiContext
        .postContactMentor({ category, emailText: message })
        .then(() => setFormState(FormStates.SUCCESS))
        .catch(() => setFormState(FormStates.FAILED));
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
          <SelectStyle
            onChange={(e) => setCategory(MentoringCategory[e.target.value])}
            value={category}
          >
            {Object.values(MentoringCategory).map((c) => (
              <option value={c}>{messageLabels.get(c)}</option>
            ))}
          </SelectStyle>
        </div>
        <div className={classes.image}>
          <Images.MentoringPic />
        </div>
        <div className={classes.input}>
          <textarea
            id="questionsMentoring"
            required
            className={classes.inputField}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <div className={classes.checkboxCell}>
          <Checkbox
            className={classes.checkbox}
            value={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
          >
            Agreement
          </Checkbox>
        </div>
        <div className={classes.warning}>
          {formState === FormStates.REVISE && `${PrintWarnings()}`}
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
      {(formState === FormStates.INIT || formState === FormStates.REVISE) &&
        FormContent()}
    </TopHighlightCard>
  );
};

export default ContactCard;
