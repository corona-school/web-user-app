import React from 'react';
import styled from 'styled-components';

const Container = styled.article<{ cardDirection: 'row' | 'column' }>`
  background: #ffffff;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;

  padding: 15px;
  display: flex;
  flex-direction: column;

  width: 1020px;

  & > div {
    display: flex;
    flex-direction: ${(props) => props.cardDirection};
  }

  & > div > * {
    margin: 15px;
  }
`;

const Title = styled.h2`
  font-size: 36px;
  line-height: 54px;
  font-weight: normal;
  margin: 0 15px;

  color: ${(props) => props.theme.color.gray1};
`;

const Article: React.FC<{
  title: string;
  cardDirection?: 'row' | 'column';
}> = ({ title, children, cardDirection = 'column' }) => {
  if (children === undefined) return <></>;
  return (
    <Container cardDirection={cardDirection}>
      <Title>{title}</Title>
      <div>{children}</div>
    </Container>
  );
};

export default Article;
