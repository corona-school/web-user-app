import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import { ThemeContext } from 'styled-components';
import { Text, Title } from '../Typography';

import { LinkButton } from '../button';

import classes from './FeedbackCallCard.module.scss';
import { FeedbackCall } from '../../types/FeedbackCall';
import { ApiContext } from '../../context/ApiContext';
import { feedbackCallText } from '../../assets/mentoringPageAssets';
import { LeftHighlightCard } from './FlexibleHighlightCard';

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
        console.warn(
          `Error when loading Peer-to-Peer Call data: ${err.message}`
        )
      );
  }, [apiContext]);

  return (
    <LeftHighlightCard highlightColor={theme.color.cardHighlightRed}>
      <Title size="h3">Peer-to-Peer Call</Title>
      <Text style={{ color: 'rgb(244, 72, 109)' }}>
        {feedbackCall.time
          ? moment(feedbackCall.time).format('DD.MM.YYYY HH:mm')
          : 'Momentan ist leider kein Peer-to-Peer Call geplant.'}
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
              ? 'Der Link wird 30 Minuten vor dem Call freigeschaltet.'
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
