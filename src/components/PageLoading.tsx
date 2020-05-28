import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div<{ opacity: number }>`
  align-items: center;
  background-color: ${(props) => props.theme.color.pageBackground};
  display: flex;
  font-size: 18px;
  min-height: 100vh;
  justify-content: center;

  p {
    opacity: ${(props) => props.opacity};
    transition: opacity 1s ease 1s;
  }
`;

const PageLoading: React.FC = ({ children }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => setOpacity(1), []);

  return (
    <PageWrapper opacity={opacity}>
      <p>{children || 'Laden...'}</p>
    </PageWrapper>
  );
};

export default PageLoading;
