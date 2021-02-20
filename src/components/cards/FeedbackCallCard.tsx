import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import { ThemeContext } from 'styled-components';
import { Text, Title } from '../Typography';

import styles from './FeedbackCallCard.module.scss';
import { FeedbackCall } from '../../types/FeedbackCall';
import { ApiContext } from '../../context/ApiContext';
import { feedbackCallText } from '../../assets/mentoringPageAssets';
import { LeftHighlightCard } from './FlexibleHighlightCard';
import AccentColorButton from '../button/AccentColorButton';

const FeedbackCallCard = () => {
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
        } else if (
          new Date(res.time).getTime() - new Date().getTime() <=
          1800000
        ) {
          setLinkActive(true);
        }
      })
      .catch((err) =>
        console.warn(`Error when loading feedback call data: ${err.message}`)
      );
  }, [apiContext]);

  return (
    <LeftHighlightCard highlightColor={theme.color.cardHighlightRed}>
      <Title size="h3">Feedback-Call</Title>
      <Text style={{ color: 'rgb(244, 72, 109)' }}>
        {feedbackCall.time
          ? moment(feedbackCall.time).format('DD.MM.YYYY HH:mm')
          : 'Momentan ist leider kein Feedback-Call geplant.'}
      </Text>
      <Text>{feedbackCallText}</Text>
      {linkActive && (
        <AccentColorButton
          onClick={() => window.open(feedbackCall.link, '_blank')}
          accentColor="#F4486D"
          label="Teilnehmen"
          className={styles.buttonParticipate}
          small
        />
      )}
      {!linkActive && (
        <Tooltip
          title={
            feedbackCall.link
              ? 'Der Link wird 30 Minuten vor dem Call freigeschaltet.'
              : 'Aktuell gibt es keinen Link.'
          }
          placement="topRight"
          // TODO doesn't work
        >
          <AccentColorButton
            accentColor="#F4486D"
            label="Teilnehmen"
            className={styles.buttonParticipate}
            disabled
            title={
              feedbackCall.link
                ? 'Der Link wird 30 Minuten vor dem Call freigeschaltet.'
                : 'Aktuell gibt es keinen Link.'
            }
            small
          />
        </Tooltip>
      )}
    </LeftHighlightCard>
  );
};

export default FeedbackCallCard;
