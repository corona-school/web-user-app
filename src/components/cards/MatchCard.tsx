import React from 'react';
import styled from 'styled-components';
import { Match, ProjectMatch } from '../../types';
import Button, { LinkButton } from '../button';
import Icons from '../../assets/icons';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import classes from './MatchCard.module.scss';
import { Tag } from '../Tag';
import {
  TuteeJufoParticipationIndicationMap,
  TutorJufoParticipationIndicationMap,
} from '../../assets/jufoParticipationStatus';
import { TuteeJufoParticipationIndication } from '../../types/ProjectCoach';

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
  dissolved: boolean;
  handleDissolveMatch: () => void;
}

interface ProjectProps {
  match: ProjectMatch;
  type: 'coachee' | 'coach';
  handleDissolveMatch: () => void;
}

const setHighlightColor = (isDissolvedMatch: boolean) => {
  let color: string;
  if (isDissolvedMatch) {
    color = '#DE2C18';
  } else {
    color = '#71DE5A';
  }
  return color;
};

const MatchCard: React.FC<Props> = ({
  match,
  type,
  dissolved,
  handleDissolveMatch,
}) => {
  return (
    <CardBase
      highlightColor={setHighlightColor(dissolved)}
      className={classes.baseContainer}
    >
      <div className={classes.container}>
        <div className={classes.matchInfoContainer}>
          <Title size="h4" bold>
            {match.firstname} {match.lastname}
          </Title>
          <Text className={classes.emailText} large>
            {match.email}
          </Text>
        </div>
        <div className={classes.tagContainer}>
          <Tag background="#4E555C" color="#ffffff">
            {type === 'pupil' ? `${match.grade}. Klasse` : `Student*in`}
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
        {!dissolved && (
          <ButtonContainer>
            <LinkButton
              color="#71DE5A"
              backgroundColor="#F4FFF2"
              href={match.jitsilink}
              target="_blank"
              style={{ margin: '4px' }}
            >
              <Icons.VideoChat />
              Video-Chat
            </LinkButton>
            <LinkButton
              href={`mailto: ${match.email}`}
              style={{ margin: '4px' }}
              color="#71DE5A"
              backgroundColor="#F4FFF2"
            >
              <Icons.Contact />
            </LinkButton>
            <Button
              onClick={handleDissolveMatch}
              style={{ margin: '4px' }}
              color="#71DE5A"
              backgroundColor="#F4FFF2"
            >
              <Icons.Delete />
            </Button>
          </ButtonContainer>
        )}
      </div>
    </CardBase>
  );
};

export const ProjectMatchCard: React.FC<ProjectProps> = ({
  match,
  type,
  handleDissolveMatch,
}) => {
  console.log(match.jufoParticipation as TuteeJufoParticipationIndication);

  return (
    <CardBase
      highlightColor={setHighlightColor(match.dissolved)}
      className={classes.baseContainer}
    >
      <div className={classes.container}>
        <div className={classes.matchInfoContainer}>
          <Title size="h4">
            {match.firstname} {match.lastname}
          </Title>
          <Text className={classes.emailText}>{match.email}</Text>
        </div>
        <div className={classes.tagContainer}>
          <Tag background="#4E555C" color="#ffffff">
            {type === 'coachee' ? `${match.grade}. Klasse` : `Coach`}
          </Tag>
        </div>
        <div className={classes.subjectContainer}>
          <Text large>
            <b>Projektbereich</b>
          </Text>
          <Text className={classes.emailText} large>
            {match.projectFields.map((s, i) =>
              i !== match.projectFields.length - 1 ? `${s}, ` : s
            )}
          </Text>
        </div>
        <div>
          <Text>
            {type === 'coachee'
              ? `Nimmt an Jugend forscht teil: ${
                  TuteeJufoParticipationIndicationMap[
                    match.jufoParticipation.toUpperCase()
                  ]
                }`
              : `War Jugend-forscht-Teilnehmer: ${
                  TutorJufoParticipationIndicationMap[
                    match.jufoParticipation.toUpperCase()
                  ]
                }`}
          </Text>
        </div>
        <div>
          {type === 'coach' &&
            match.projectMemberCount &&
            `Projekt hat ${match.projectMemberCount} Teilnehmer.`}
        </div>
        {!match.dissolved && (
          <ButtonContainer>
            <LinkButton
              color="#71DE5A"
              backgroundColor="#F4FFF2"
              href={match.jitsilink}
              target="_blank"
              style={{ margin: '4px' }}
            >
              <Icons.VideoChat />
              Video-Chat
            </LinkButton>
            <LinkButton
              href={`mailto: ${match.email}`}
              style={{ margin: '4px' }}
              color="#71DE5A"
              backgroundColor="#F4FFF2"
            >
              <Icons.Contact />
            </LinkButton>
            <Button
              onClick={handleDissolveMatch}
              style={{ margin: '4px' }}
              color="#71DE5A"
              backgroundColor="#F4FFF2"
            >
              <Icons.Delete />
            </Button>
          </ButtonContainer>
        )}
      </div>
    </CardBase>
  );
};

export default MatchCard;
