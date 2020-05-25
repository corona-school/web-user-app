import React from 'react';
import styled from 'styled-components';

const Name = styled.h3`
  color: #333333;
  display: inline;
  line-height: 27px;
  margin: 0;
  font-weight: normal;
  font-size: 18px;
`;

const Email = styled.em`
  /* Gray 3 */
  color: #828282;
  display: inline-block;
  font-size: 0.7rem;
`;

const Container = styled.div`
  /* Auto Layout */
  display: flex;
  flex-direction: row;
  margin: 10px;
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .children {
    margin-top: 20px;
  }
`;

interface Props {
  name: string;
  email: string;
  children?: React.ReactNode;
}

const Chip: React.FC<Props> = (props) => (
  <Container>
    <UserContainer>
      <Name>{props.name}</Name>
      <Email>{props.email}</Email>
      <div className="children">{props.children}</div>
    </UserContainer>
  </Container>
);

export default Chip;
