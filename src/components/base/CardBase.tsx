import React from 'react';
import Highlight from '../Highlight';
import styled from 'styled-components';

const Container = styled.div`
  background: #ffffff;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;

  padding: 0 12px;
  padding-bottom: 5px;
`;

const CardBase: React.FC<{
  highlightColor: string;
  className?: string;
}> = ({ highlightColor, className, children }) => {
  return (
    <div className={className}>
      <Highlight color={highlightColor} />
      <Container>{children}</Container>
    </div>
  );
};

export default CardBase;
