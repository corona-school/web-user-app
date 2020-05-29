import React from 'react';
import { Match } from '../../types';
import styled from 'styled-components';
import { OldButton, LinkButton } from '../button';
import media from '../../media';
import Icons from '../../assets/icons';
import MatchInfo from '../cards/MatchInfo';
import CardBase from '../base/CardBase';

const CardContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 960px;

  ${media.tablet} {
    width: 630px;
  }

  ${media.phone} {
    flex-direction: column;
    width: 300px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 15px 5px;
  flex-direction: column;
  justify-content: space-around;

  ${media.desktop} {
    flex-direction: row;
  }
`;

interface Props {
  match: Match;
  type: 'pupil' | 'student';
  handleDissolveMatch: () => void;
}

const UserCard: React.FC<Props> = ({ match, type, handleDissolveMatch }) => {
  // TODO: Replace with back-end data
  return (
    <CardBase highlightColor="#9FE88D">
      <CardContainer>
        <MatchInfo match={match} type={type} />
        <ButtonContainer>
          <LinkButton
            icon={<Icons.VideoChat />}
            text="Video-Chat"
            href={match.jitsilink}
            target={'_blank'}
          />
          <LinkButton
            icon={<Icons.Contact />}
            text="Kontaktieren"
            href={'mailto:' + match.email}
          />
          <OldButton
            icon={<Icons.Delete />}
            text="Entfernen"
            onClick={handleDissolveMatch}
          />
        </ButtonContainer>
      </CardContainer>
    </CardBase>
  );
};

export default UserCard;
