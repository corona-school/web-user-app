import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {Checkbox} from 'antd';
import Button from '../button';
import Images from '../../assets/images';
// import Icons from '../../assets/icons';
import CardBase from '../base/CardBase';
import {Text, Title} from '../Typography';
// import CertificateModal from '../Modals/CerificateModal';
// import { Tag } from '../Tag';
import classes from './MentoringCard.module.scss';
// import BecomeInstructorModal from '../Modals/BecomeInstructorModal';
// import BecomeInternModal from '../Modals/BecomeInternModal';
import {messageLabels} from "../../assets/mentoringPageAssets";
import {MentoringCategory} from "../../types/Mentoring";
import {ApiContext} from "../../context/ApiContext";

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

const SelectWrapper = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  justify-content: space-evenly;
`;

enum FormStates {
  INIT,
  REVISE,
  SUCCESS,
  FAILED,
}

const MentoringCard = () => {
  const apiContext = useContext(ApiContext);

  const [formState, setFormState] = useState<FormStates>(FormStates.INIT);
  const [category, setCategory] = useState<MentoringCategory>(MentoringCategory.LANGUAGE);
  const [message, setMessage] = useState<string>('');
  const [agreementChecked, setAgreementChecked] = useState(false);

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

  return (
    <>
      <CardBase highlightColor="#F4486D" className={classes.baseContainer}>
        <div className={classes.container}>
          <div>
            <Title size="h4" bold>
              Du hast Fragen?
            </Title>

            <SelectWrapper>
              <Text large> Kategorie: </Text>
              <SelectStyle
                onChange={(e) => setCategory(MentoringCategory[e.target.value])}
                value={category}
              >
                {Object.values(MentoringCategory).map((c) => (
                  <option value={c}>{messageLabels.get(c)}</option>
                ))}
              </SelectStyle>

              <Images.MentoringPic
                width="120px"
                height="120px"
                marginLeft="auto"
                padding="5px"
              />
            </SelectWrapper>
          </div>

          <div>
            <textarea
              id="questionsMentoring"
              required
              className={classes.inputfield}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
        </div>
        <Checkbox
          className={classes.checkbox}
          value={agreementChecked}
          onChange={(e) => setAgreementChecked(e.target.checked)}
        >
          Agreement
        </Checkbox>
        <Button className={classes.buttonSend} onClick={SendMessage}>
          Abschicken
        </Button>
      </CardBase>
    </>
  );
};

export default MentoringCard;
