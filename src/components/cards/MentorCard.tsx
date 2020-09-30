import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Card from './Card';
import { Subject, SubjectName } from '../../types';
//import Context from '../../context';




const CardWrapper = styled.div`
  padding: 15px;
`;

const StyledCard = styled(Card)`
  align-items: stretch;
  color: ${(props) => props.theme.colorScheme.gray1};
  display: flex;
  flex-direction: column;
  font-size: 24px;
  height: 169px;
  justify-content: space-evenly;
  text-align: center;
  letter-spacing: -0.333333px;
  line-height: 36px;
  /* text-align: center; */
  width: 300px;
  width: 290px;
  position: relative;

  small {
    font-style: italic;
    font-size: 14px;
    line-height: 21px;
    /* text-align: center; */
    letter-spacing: -0.333333px;
    color: ${(props) => props.theme.colorScheme.gray2};
  }
`;




const MentorCard: React.FC<{
  subject: Subject;
}> = ({ subject }) => {

  return (
    <CardWrapper>
      <StyledCard>
      {subject.name}
       
      </StyledCard>
    </CardWrapper>
  );
};

export default MentorCard;


