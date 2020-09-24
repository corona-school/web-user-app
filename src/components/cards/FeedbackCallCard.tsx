import React, {useContext, useEffect, useState} from 'react';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';

import Button, { LinkButton } from '../button';
//import { CourseOverview } from '../../types/Course';

import classes from './FeedbackCallCard.module.scss';
import { User } from '../../types';
import {FeedbackCall} from "../../types/FeedbackCall";
import {ApiContext} from "../../context/ApiContext";
import moment from "moment";
import  { Tooltip } from "antd";
import {feedbackCallText} from "../../assets/mentoringPageAssets";
import {LeftHighlightCard} from "./FlexibleHighlightCard";
import {ThemeContext} from "styled-components";

interface Props {
    user: User;
  }

const FeedbackCallCard: React.FC<Props> = ({ user }) => {
  const [feedbackCall, setFeedbackCall] = useState<FeedbackCall>({});
  const [linkActive, setLinkActive] = useState(false);
  const apiContext = useContext(ApiContext);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    apiContext
      .getFeedbackCallData()
      .then((res) => {
        setFeedbackCall(res);
        return res;
      })
      .then((res) => {
        if (!res.link) {
          setLinkActive(false);
        }
        if (new Date(res.time).getTime() - new Date().getTime() <= 3600000) {
          setLinkActive(true);
        }
      })
      .catch((err) =>
        console.warn(`Error when loading feedback call data: ${err.message}`)
      );
  }, [apiContext]);

  return (
    <LeftHighlightCard highlightColor={theme.color.cardHighlightRed}>
      <Title size="h3">Feedback Call</Title>
      <Text style={{ color: 'rgb(244, 72, 109)' }}>
        {feedbackCall.time
          ? moment(feedbackCall.time).format('DD.MM.YYYY hh:mm')
          : 'Momentan ist leider kein Feedback-Call geplant.'}
      </Text>
      <Text>{feedbackCallText}</Text>
      {linkActive && (
        <LinkButton
          className={classes.buttonParticipate}
          href={feedbackCall.link}
          target="_blank"
          style={{ margin: '4px' }}
        >
          Teilnehmen
        </LinkButton>
      )}
      {!linkActive && (
        <Tooltip
          title={
            feedbackCall.link
              ? 'Der Link wird 30 Minuten vor dem Call freigeschaltet'
              : 'Aktuell gibt es keinen Link.'
          }
          placement="topRight"
        >
          <LinkButton
            className={classes.inactiveButtonParticipate}
            style={{ margin: '4px' }}
          >
            Teilnehmen
          </LinkButton>
        </Tooltip>
      )}
    </LeftHighlightCard>
  );
};

export default FeedbackCallCard;
