import React from 'react';
import styled from 'styled-components';
import Chip from '../cardsOld/Chip';
import Avatar from './Avatar';
import { Match, Subject } from '../../types';

const Grade = styled.h4`
  margin: 0;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 21px;

  /* identical to box height */
  letter-spacing: -0.333333px;

  /* Gray 2 */
  color: #4f4f4f;
`;

const CardContent = styled.div`
  display: flex;
`;

const UserInfo = styled.div``;

const Subjects = styled.p`
  width: 230px;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.333333px;
  color: #4f4f4f;
`;

const Info = styled.p`
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;

  /* identical to box height */
  letter-spacing: -0.333333px;

  /* Gray 3 */
  color: #828282;
`;

interface Props {
  match: Match;
  type: 'pupil' | 'student';
}

const MatchInfo: React.FC<Props> = (props) => {
  const {
    match: { firstname, lastname, grade, subjects, email },
    type,
  } = props;

  const fullName = firstname + ' ' + lastname;

  const renderSubjects = (subjects: string[]) => {
    if (subjects.length === 0) {
      return 'Kein Angabe';
    }

    if (subjects.length === 1) {
      return subjects[0];
    }

    return subjects.map((s, i) => {
      if (i !== subjects.length - 1) {
        return s + ', ';
      }
      return s;
    });
  };

  return (
    <CardContent>
      <div>
        <Avatar firstname={firstname} lastname={lastname} />
      </div>

      <Chip name={fullName} email={email}>
        <UserInfo>
          <Grade>{type === 'pupil' ? `${grade}. Klasse` : 'Student*in'}</Grade>
          <Subjects>{renderSubjects(subjects)}</Subjects>
        </UserInfo>
      </Chip>
    </CardContent>
  );
};

export default MatchInfo;
