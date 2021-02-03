import styled from 'styled-components';

interface Props {
  background?: string;
  color?: string;
  fontSize?: string;
}

export const Tag = styled.div<Props>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : '10px')};
  border-radius: 4px;
  margin: 4px;

  display: inline-block;
  font-weight: 500;
  padding: 4px 8px;
  background: ${(props) => (props.background ? props.background : '#7083E0')};
  color: ${(props) => (props.color ? props.color : '#ffffff')};
`;
