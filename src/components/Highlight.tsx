import React from 'react';
import styled from 'styled-components';

// TODO : Replace with tr element
const ColoredHighlight = styled.div`
  padding: inherit;
  padding-top: 10px;
  background-color: ${(props) => props.color};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const Highlight: React.FC<{ color: string }> = ({ color }) => {
  return <ColoredHighlight color={color}></ColoredHighlight>;
};

export default Highlight;
