import React from 'react';
import { Match } from '../../types';
import styled from 'styled-components';
import Button, { LinkButton } from '../button';
import Icons from '../../assets/icons';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import classes from './MatchCard.module.scss';
import { Tag } from '../Tag';

const CardContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 15px 5px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

interface Props {
  match: Match;
  type: 'pupil' | 'student';
  handleDissolveMatch: () => void;
}

const MatchCard: React.FC<Props> = ({ match, type, handleDissolveMatch }) => {
  return (
    <CardBase highlightColor="#9FE88D">
      <CardContainer>
        <div className={classes.matchInfoContainer}>
          <Title size="h4" bold>
            {match.firstname} {match.lastname}
          </Title>
          <Text className={classes.emailText} large>
            {match.email}
          </Text>
        </div>
        <div className={classes.tagContainer}>
          <Tag>
            {type === 'pupil' ? `${match.grade}. Klasse` : `Stundent*in`}
          </Tag>
        </div>
        <div className={classes.subjectContainer}>
          <Text large>
            <b>Fächer</b>
          </Text>
          <Text className={classes.emailText} large>
            {match.subjects.map((s, i) =>
              i !== match.subjects.length - 1 ? `${s}, ` : s
            )}
          </Text>
        </div>
        <ButtonContainer>
          <LinkButton
            href={match.jitsilink}
            target="_blank"
            style={{ margin: '4px' }}
          >
            <Icons.WriteFilled />
            Video-Chat
          </LinkButton>
          <LinkButton href={'mailto:' + match.email} style={{ margin: '4px' }}>
            <Icons.Contact />
          </LinkButton>
          <Button onClick={handleDissolveMatch} style={{ margin: '4px' }}>
            <Icons.Delete />
          </Button>
        </ButtonContainer>
      </CardContainer>
    </CardBase>
  );
};

export default MatchCard;
