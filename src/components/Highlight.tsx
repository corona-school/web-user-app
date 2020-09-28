import styled from 'styled-components';

const Highlight = styled.div`
  background-color: ${(props) => props.color};
  width: 8px;
`;

export const TopHighlight = styled.div`
  background-color: ${(props) => props.color};
  height: 8px;
`;

export default Highlight;
