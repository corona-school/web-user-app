import React from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

const PageWrapper = styled.div`
  align-items: center;

  display: flex;
  font-size: 18px;
  min-height: 100vh;
  min-width: 100vw;
  justify-content: center;
`;

type Props = {
  text?: string; 
}

const PageLoading: React.FC<Props> = ({ children, text }) => {
  if (!children) {
    return (
      <PageWrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ClipLoader size={100} color={'#123abc'} loading={true} />
          <p>{text ? text : "Du wirst eingeloggt..."}</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div>{children}</div>
    </PageWrapper>
  );
};

export default PageLoading;
