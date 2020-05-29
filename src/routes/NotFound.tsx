import React from 'react';
import styled from 'styled-components';
import { OldButton } from '../components/button';
import { useHistory } from 'react-router-dom';

const PageWrapper = styled.div<{ opacity: number }>`
  align-items: center;
  background-color: ${(props) => props.theme.color.pageBackground};
  display: flex;
  flex-direction: column;
  font-size: 18px;
  height: 100vh;
  justify-content: center;

  p {
    opacity: ${(props) => props.opacity};
    transition: opacity 1s ease 1s;
  }
`;

const NotFound = () => {
  const history = useHistory();
  return (
    <PageWrapper opacity={1}>
      <h1>404 Seite nicht gefunden</h1>

      <OldButton
        text={'zurück'}
        onClick={() => {
          history.goBack();
        }}
      />
    </PageWrapper>
  );
};

export default NotFound;
