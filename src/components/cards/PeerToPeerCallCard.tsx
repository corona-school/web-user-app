import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import { ThemeContext } from 'styled-components';
import { Text, Title } from '../Typography';

import { LinkButton } from '../button';

import classes from './PeerToPeerCallCard.module.scss';
import { ApiContext } from '../../context/ApiContext';
import { PeerToPeerCallText } from '../../assets/mentoringPageAssets';
import { LeftHighlightCard } from './FlexibleHighlightCard';

const PeerToPeerCallCard = () => {
  const [PeerToPeerCall, setPeerToPeerCall] = useState<PeerToPeerCall>({});
  const [linkActive, setLinkActive] = useState(false);
  const apiContext = useContext(ApiContext);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    apiContext
      .getPeerToPeerCallData()
      .then((res) => {
        setPeerToPeerCall(res);
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
          `Error when loading Peer-to-Peer call data: ${err.message}`
        )
      );
  }, [apiContext]);

  return (
    <LeftHighlightCard highlightColor={theme.color.cardHighlightRed}>
      <Title size="h3">Peer-to-Peer Call</Title>
      <Text style={{ color: 'rgb(244, 72, 109)' }}>
        {PeerToPeerCall.time
          ? moment(PeerToPeerCall.time).format('DD.MM.YYYY HH:mm')
          : 'Momentan ist leider kein PeerToPeer-Call geplant.'}
      </Text>
      <Text>{PeerToPeerCallText}</Text>
      {linkActive && (
        <LinkButton
          className={classes.buttonParticipate}
          href={PeerToPeerCall.link}
          target="_blank"
          style={{ margin: '4px' }}
        >
          Teilnehmen
        </LinkButton>
      )}
      {!linkActive && (
        <Tooltip
          title={
            PeerToPeerCall.link
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

export default PeerToPeerCallCard;
