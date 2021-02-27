import React from 'react';
import styled from 'styled-components';
import { Match, ProjectMatch } from '../../types';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import classes from './MatchCard.module.scss';
import { Tag } from '../Tag';
import { ReactComponent as Trashcan } from '../../assets/icons/trashcan.svg';
import { ReactComponent as Envelope } from '../../assets/icons/envelope-solid.svg';
import { ReactComponent as VideoCamera } from '../../assets/icons/video-solid.svg';
import {
  TuteeJufoParticipationIndication,
  TutorJufoParticipationIndication,
} from '../../types/ProjectCoach';
import AccentColorButton from '../button/AccentColorButton';

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 15px 5px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  > button {
    margin-right: 10px;
  }
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
    color = '#26b306';
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
            <AccentColorButton
              label="Video-Chat"
              onClick={() => window.open(match.jitsilink, '_blank')}
              accentColor="#26b306"
              Icon={VideoCamera}
              small
            />

            <AccentColorButton
              onClick={() => window.open(`mailto: ${match.email}`)}
              accentColor="#26b306"
              small
              Icon={Envelope}
            />

            <AccentColorButton
              onClick={handleDissolveMatch}
              accentColor="#26b306"
              small
              Icon={Trashcan}
            />
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
            <b>Projektbereiche</b>
          </Text>
          <Text className={classes.emailText} large>
            {match.projectFields.map((s, i) =>
              i !== match.projectFields.length - 1 ? `${s}, ` : s
            )}
          </Text>
        </div>
        {type === 'coachee' && (
          <div className={classes.projectInfoContainer}>
            {match.jufoParticipation ===
              TuteeJufoParticipationIndication.YES && (
              <Tag color="#FFFFFF" background="#26b306">
                Nimmt an Jugend forscht teil
              </Tag>
            )}
            <Tag background="#4E555C" color="#ffffff">
              {`${match.projectMemberCount} Projektteilnehmer*innen`}
            </Tag>
          </div>
        )}
        {type === 'coach' &&
          match.jufoParticipation === TutorJufoParticipationIndication.YES && (
            <Tag color="#FFFFFF" background="#71DE5A">
              Hat an Jugend forscht teilgenommen
            </Tag>
          )}
        {!match.dissolved && (
          <ButtonContainer>
            <AccentColorButton
              label="Video-Chat"
              onClick={() => window.open(match.jitsilink, '_blank')}
              accentColor="#26b306"
              Icon={VideoCamera}
              small
            />

            <AccentColorButton
              onClick={() => window.open(`mailto: ${match.email}`)}
              accentColor="#26b306"
              small
              Icon={Envelope}
            />

            <AccentColorButton
              onClick={handleDissolveMatch}
              accentColor="#26b306"
              small
              Icon={Trashcan}
            />
          </ButtonContainer>
        )}
      </div>
    </CardBase>
  );
};

export default MatchCard;
